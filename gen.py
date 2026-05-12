import os
import io
import base64
from flask import Flask, render_template, request, jsonify
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

client = InferenceClient(
    provider="auto",
    api_key=os.environ["HF_TOKEN"],
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "Please enter a prompt"}), 400

    try:
        image = client.text_to_image(
            prompt,
            model="stabilityai/stable-diffusion-xl-base-1.0",
        )

        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return jsonify({"image": img_base64})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
