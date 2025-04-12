import numpy as np

def compute_user_profile(new_ratings, item_index_map, item_factors, item_biases, global_mean, reg_coeff, n_factors):
    """
    Compute the temporary user bias and latent factor vector for a new set of ratings.
    
    Parameters:
        new_ratings (list of tuples): List of (item_id, rating) tuples.
        item_index_map (dict): Mapping from raw item_id to index in the model arrays.
        item_factors (np.array): Matrix of item latent vectors (num_items x n_factors).
        item_biases (np.array): Array of item biases.
        global_mean (float): Global average rating.
        reg_coeff (float): Regularization coefficient (λ).
        n_factors (int): Number of latent factors.
    
    Returns:
        b_u (float): Computed user bias.
        u (np.array): Computed user latent vector (length n_factors).
    """
    if len(new_ratings) == 0:
        return 0.0, np.zeros(n_factors)
    
    X_list = []
    y_list = []
    for (item_id, rating) in new_ratings:
        if item_id not in item_index_map:
            continue  # skip unknown item_id
        idx = item_index_map[item_id]
        v_i = item_factors[idx]      # latent vector for this item
        b_i = item_biases[idx]       # bias for this item
        # Adjust rating by subtracting global mean and item bias.
        adj_rating = rating - (global_mean + b_i)
        # Feature vector: first element for user bias, then latent factors.
        X_list.append(np.hstack(([1.0], v_i)))
        y_list.append(adj_rating)
    
    X = np.vstack(X_list)  # shape: (num_ratings, 1+n_factors)
    y = np.array(y_list)   # shape: (num_ratings,)
    
    # Solve regularized least squares: (X^T X + λ*I)θ = X^T y, but do not regularize bias (first element).
    lam = reg_coeff
    XTX = X.T.dot(X)
    XTy = X.T.dot(y)
    reg_matrix = np.eye(XTX.shape[0])
    reg_matrix[0, 0] = 0  # no regularization on the bias term
    A = XTX + lam * reg_matrix
    theta = np.linalg.solve(A, XTy)
    b_u = theta[0]
    u = theta[1:]
    return b_u, u

def recommend_top_n(b_u, u, rated_item_ids, item_factors, item_biases, global_mean, item_ids_list, N=20):
    """
    Compute predictions for all items and return the top N recommendations that the user hasn't rated.
    
    Parameters:
        b_u (float): Computed user bias.
        u (np.array): Computed user latent vector.
        rated_item_ids (set or list): Set of already rated item IDs.
        item_factors (np.array): Matrix of item latent vectors.
        item_biases (np.array): Array of item biases.
        global_mean (float): Global average rating.
        item_ids_list (list): List of raw item IDs corresponding to the model arrays.
        N (int): Number of recommendations to return.
    
    Returns:
        List of (item_id, predicted_rating) tuples.
    """
    # Compute predicted scores for all items using vectorized operations.
    user_factor_scores = item_factors.dot(u)
    baseline_scores = global_mean + b_u + item_biases
    predictions = baseline_scores + user_factor_scores

    # Filter out items that have already been rated.
    predictions_filtered = []
    for idx, pred in enumerate(predictions):
        item_id = item_ids_list[idx]
        if item_id in rated_item_ids:
            continue
        predictions_filtered.append((item_id, pred))

    # Sort the remaining items by predicted rating (descending order) and select top-N.
    predictions_filtered.sort(key=lambda x: x[1], reverse=True)
    top_recs = predictions_filtered[:N]
    return top_recs
