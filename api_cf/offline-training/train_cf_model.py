import os
import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from sklearn.utils import shuffle
from pathlib import Path
from surprise import Dataset, Reader, SVD, accuracy
import numpy as np
import pickle

# Load environment variables from the .env file
# Check for an environment variable specifying which .env file to load.
# Default to .env.local if ENV_FILE is not set.
env_file = os.getenv("ENV_FILE", ".env.local")
load_dotenv(dotenv_path=env_file)

# Retrieve database connection parameters from the .env file
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "me")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME", "recommend")
USER_THRESHOLD = int(os.getenv("USER_THRESHOLD", 8))  # Minimum number of ratings per user
GAMES_THRESHOLD = int(os.getenv("GAMES_THRESHOLD", 20))  # Minimum number of ratings per game
MODEL_OUTPUT_PATH = os.getenv("MODEL_OUTPUT_PATH", '../model_data/item_factors.pkl')
print("DB_HOST:", DB_HOST)
print("DB_PORT:", DB_PORT)
print("DB_USER:", DB_USER)
print("USER_THRESHOLD:", USER_THRESHOLD)
print("GAMES_THRESHOLD:", GAMES_THRESHOLD)
print("MODEL_OUTPUT_PATH:", MODEL_OUTPUT_PATH)

def fetch_ratings_from_db():
    """Connect to PostgreSQL and fetch all historical user-rating data."""
    try:
        # Establish connection to PostgreSQL using psycopg2
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME
        )
        # Use a RealDictCursor so that columns are returned as dictionary keys
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Execute SQL query to fetch the data (adjust table name and column names as needed)
        print("Fetching ratings from the database...")
        
        query = "SELECT user_id, game_id, rating FROM user_ratings;" #TODO: Adjust the query to match the table name
        cursor.execute(query)
        
        # Fetch all rows into a list of dictionaries
        rows = cursor.fetchall()
        # Create a pandas DataFrame from the query result
        df = pd.DataFrame(rows)
        
        # Close the cursor and connection
        cursor.close()
        conn.close()
        
        return df
        
    except Exception as e:
        print("Error fetching ratings from the database:", e)
        return None
    
def preprocess_ratings(df):
    """Clean and preprocess the ratings DataFrame."""
    if df is None:
        raise ValueError("The input DataFrame is None. Cannot preprocess data.")

    print("Initial Data shape:", df.shape)
    # --- Before cleaning overview ---
    print("=== Before Cleaning ===")
    print(f"Total ratings: {df.shape[0]}")
    print(f"Unique users: {df['user_id'].nunique()}")
    print(f"Unique games (game_id): {df['game_id'].nunique()}")
    
    # Remove rows with missing user_ids or ratings
    initial_count = len(df)
    df = df.dropna(subset=['user_id', 'rating'])
    after_na_count = len(df)
    print(f"Removed {initial_count - after_na_count} rows with missing values.")
    
    # Remove duplicate user-game entries (keep the last entry)
    df = df.drop_duplicates(subset=['user_id', 'game_id'], keep='last')
    print("After dropping duplicates, data shape:", df.shape)
    
    # Filter out users with less than 3 ratings and games with less than 5 ratings.
    user_counts = df['user_id'].value_counts()
    game_counts = df['game_id'].value_counts()
    
    users_to_keep = user_counts[user_counts >= USER_THRESHOLD].index
    games_to_keep = game_counts[game_counts >= GAMES_THRESHOLD].index
    
    df = df[ df['user_id'].isin(users_to_keep) & df['game_id'].isin(games_to_keep) ]
    print("After filtering sparse users and games, data shape:", df.shape)
    
    # Re-check rating range
    print("Rating range in dataset:", df['rating'].min(), "to", df['rating'].max())
    
    print("\n=== After Cleaning ===")
    print(f"Total ratings: {df.shape[0]}")
    print(f"Unique users: {df['user_id'].nunique()}")
    print(f"Unique games (game_id): {df['game_id'].nunique()}")
    
    return df

def split_train_valid_test(df, train_frac=0.8, valid_frac=0.1):
    df = shuffle(df, random_state=42)

    train_list, valid_list, test_list = [], [], []
    grouped = df.groupby('user_id')

    for user, group in grouped:
        n_ratings = len(group)
        if n_ratings < 3:
            continue

        n_train = max(1, int(round(train_frac * n_ratings)))
        n_valid = max(1, int(round(valid_frac * n_ratings)))

        n_test = n_ratings - n_train - n_valid
        if n_test < 1:
            n_test = 1
            n_train = n_ratings - n_valid - n_test

        group_shuffled = group.sample(frac=1, random_state=42)

        train_list.append(group_shuffled.iloc[:n_train])
        valid_list.append(group_shuffled.iloc[n_train:n_train + n_valid])
        test_list.append(group_shuffled.iloc[n_train + n_valid:])

    train_df = pd.concat(train_list)
    valid_df = pd.concat(valid_list)
    test_df = pd.concat(test_list)

    print("Train set shape:", train_df.shape)
    print("Validation set shape:", valid_df.shape)
    print("Test set shape:", test_df.shape)
    print("Unique users in train:", train_df['user_id'].nunique())
    print("Unique users in test:", test_df['user_id'].nunique())

    train_df.to_csv("./data/train_df.csv", index=False)
    valid_df.to_csv("./data/valid_df.csv", index=False)
    test_df.to_csv("./data/test_df.csv", index=False)

    return train_df, valid_df, test_df

def train_svd_with_early_stopping(train_df, valid_df):
    reader = Reader(rating_scale=(0, 10))
    train_data = Dataset.load_from_df(train_df[['user_id', 'game_id', 'rating']], reader)
    trainset = train_data.build_full_trainset()

    validset = [tuple(row) for row in valid_df[['user_id', 'game_id', 'rating']].values]

    max_epochs = 30
    patience = 3
    best_rmse = np.inf
    epochs_without_improve = 0
    best_algo = None

    print("Training SVD model with early stopping...")
    for epoch in range(1, max_epochs + 1):
        algo = SVD(n_factors=50, n_epochs=epoch, lr_all=0.005, reg_all=0.02, random_state=42)
        algo.fit(trainset)

        predictions = algo.test(validset)
        current_rmse = accuracy.rmse(predictions, verbose=False)
        print(f"Epoch {epoch}, Validation RMSE: {current_rmse:.4f}")

        if current_rmse < best_rmse:
            best_rmse = current_rmse
            best_algo = algo
            epochs_without_improve = 0
        else:
            epochs_without_improve += 1

        if epochs_without_improve >= patience:
            print(f"Early stopping at epoch {epoch}. Best Validation RMSE: {best_rmse:.4f}")
            break

    print("Model training completed.")
    return best_algo

def evaluate_and_persist_model(algo, test_df):
    testset = [tuple(row) for row in test_df[['user_id', 'game_id', 'rating']].values]
    predictions = algo.test(testset)

    accuracy.rmse(predictions, verbose=True)
    accuracy.mae(predictions, verbose=True)

    # Compute additional metadata
    trainset = algo.trainset
    # Create a list of raw item IDs in the order corresponding to algo.qi and algo.bi.
    item_ids_list = [trainset.to_raw_iid(inner_id) for inner_id in trainset.all_items()]
    # Create a mapping: raw item id --> index in the model arrays.
    item_index_map = {item_id: idx for idx, item_id in enumerate(item_ids_list)}
    # Set reg_coeff (use algo.reg_all if available or a default value).
    reg_coeff = getattr(algo, 'reg_all', 0.02)

    # Build the model artifact dictionary.
    model_artifact = {
        'item_factors': algo.qi,           # NumPy array (num_items x n_factors)
        'item_biases': algo.bi,             # NumPy array (num_items,)
        'global_mean': trainset.global_mean,  # float
        'item_ids_list': item_ids_list,     # list of raw item IDs
        'item_index_map': item_index_map,   # dict mapping item_id -> index
        'reg_coeff': reg_coeff              # Regularization coefficient
    }

    with open(MODEL_OUTPUT_PATH, 'wb') as f:
        pickle.dump(model_artifact, f)
    print(f"Model parameters persisted at: {MODEL_OUTPUT_PATH}")

if __name__ == "__main__":
    # Step 1: Connect to the DB and retrieve all historical rating data.
    ratings_df = fetch_ratings_from_db()
    
    # Step 2: Preprocess the data
    ratings_df = preprocess_ratings(ratings_df)

    # Step 3: Split the data into train, validation, and test sets
    train_df, valid_df, test_df = split_train_valid_test(ratings_df)

    # SeedUp: Load the data from CSV files if they exist
    # Load train, validation, and test datasets from CSV files
    # train_df = pd.read_csv("./data/train_df.csv")
    # valid_df = pd.read_csv("./data/valid_df.csv")
    # test_df  = pd.read_csv("./data/test_df.csv")

    # Step 4: Train the SVD model with early stopping
    best_model = train_svd_with_early_stopping(train_df, valid_df)
    evaluate_and_persist_model(best_model, test_df)
