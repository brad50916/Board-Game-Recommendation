# recommender_service/app.py
from flask import Flask, request, jsonify
import numpy as np
import pickle
from fold_in import compute_user_profile, recommend_top_n
import os
app = Flask(__name__)

# Load the model data once when the service starts
with open("/Users/xiaotianhong/TAMU/2025spring/INF/project/recommend/api_cf/model_data/item_factors.pkl", "rb") as f:
    model_data = pickle.load(f)



# Load model parameters and metadata
item_factors = model_data["item_factors"]      # shape: (num_items, n_factors)
item_biases = model_data["item_biases"]          # shape: (num_items,)
global_mean = model_data["global_mean"]
item_ids_list = model_data["item_ids_list"]      # list of raw item IDs
item_index_map = model_data["item_index_map"]    # mapping from raw item_id to index
reg_coeff = model_data["reg_coeff"]              # regularization coefficient
n_factors = item_factors.shape[1]                # number of latent factors

@app.route('/recommend', methods=['POST'])
def recommend():
    """
    Expects a JSON payload:
    {
        "username": "user123",
        "ratings": [(item_id, rating), ...]  // all ratings from the user (historical + new)
    }
    """
    data = request.get_json()
    # Get the ratings list (each element is a (item_id, rating) tuple).
    ratings = data.get("ratings", [])
    # Derive the set of rated item IDs from the ratings list.
    rated_item_ids = {item_id for (item_id, rating) in ratings}

    # Compute the temporary user profile using new ratings.
    b_u, u = compute_user_profile(ratings, item_index_map, item_factors,
                                  item_biases, global_mean, reg_coeff, n_factors)

    # Generate top-N recommendations for the user.
    top_recs = recommend_top_n(b_u, u, rated_item_ids, item_factors,
                               item_biases, global_mean, item_ids_list, N=20)

    response = {
        "username": data.get("username", "unknown"),
        "recommendations": top_recs  # list of (item_id, predicted_rating) tuples
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)