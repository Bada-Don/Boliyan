from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from models.encoder import Encoder
from models.decoder import Decoder
from models.seq2seq import Seq2Seq
from config import *
from anmol_transliterate import transliterate_punjabi
from utils.vocab import CharVocab
import re

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load model and vocab
torch.serialization.add_safe_globals([CharVocab])
checkpoint = torch.load(CHECKPOINT_PATH, map_location=device, weights_only=False)

input_vocab = checkpoint['input_vocab']
target_vocab = checkpoint['target_vocab']

encoder = Encoder(len(input_vocab), EMBED_SIZE, HIDDEN_SIZE, NUM_LAYERS, DROPOUT).to(device)
decoder = Decoder(len(target_vocab), EMBED_SIZE, HIDDEN_SIZE, NUM_LAYERS, DROPOUT).to(device)
model = Seq2Seq(encoder, decoder, device).to(device)
model.load_state_dict(checkpoint['model'])
model.eval()

def split_text(text):
    # Split words but retain delimiters (spaces, hyphens, dots)
    return re.findall(r'[^\s\-\.]+|[\s\-\.]', text)

def infer_sequence(text):
    encoded = input_vocab.encode(text)
    src_tensor = torch.tensor(encoded).unsqueeze(0).to(device)
    src_len = [len(encoded)]

    with torch.no_grad():
        output = model(src_tensor, src_len, tgt=None, teacher_forcing_ratio=0.0)
        predictions = output.argmax(2).squeeze(0).tolist()
        punjabi_out = target_vocab.decode(predictions)
        anmol_out = ''.join(transliterate_punjabi(list(punjabi_out)))
        return punjabi_out, anmol_out

@app.route('/transliterate', methods=['POST'])
def transliterate():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Empty input"}), 400

    parts = split_text(text)
    punjabi_parts = []
    anmol_parts = []

    for part in parts:
        if re.match(r'[^\s\-\.]+', part): # it's a word
            pun, anm = infer_sequence(part)
        else:  # it's a separator or punctuation
            pun, anm = part, part
        punjabi_parts.append(pun)
        anmol_parts.append(anm)

    return jsonify({
        "anmol": ''.join(anmol_parts),
    })

if __name__ == "__main__":
    app.run(debug=True)
