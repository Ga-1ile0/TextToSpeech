# TTS 

Open source text to speech with a frontend and a backend interacting via a simple api.


## About

These are VITS models trained by finetuning the pretrained VITS LJSpeech model from Coqui TTS. The models are trained on various datasets which were denoised and then transcribed with OpenAI Whisper.

Compared to notaistreamer's implementation for Forsen, I believe he uses Tacotron + WaveRNN. I think the WaveRNN vocoder sounds nicer than what VITS ends up producing, but because VITS is E2E, the training is much less of a pain and can be done in a single stage for each voice.

This model is trained on phonemes instead of characters so you might need to play around with pronunciation (e.g. "foursen" instead of "forsen").

## Voice samples

- Forsen
- XQC
- Donald Trump
- Obi-Wan Kenobi (Alec Guinness)
- Juice WRLD
- David Attenborough

https://soundcloud.com/enlyth/sets/bajtts-samples

## Usage

Models were to big to upload to github.

Download the pretrained models from huggingface:

https://huggingface.co/enlyth/baj-tts/tree/main

Put the downloaded models into the `models` folder in the `backend` 

The backend is made to run as an api, the endpoint is http://localhost:8080/synthesize. The frontend is preconfigured to post to the localhost api, in production you want to change it.

```bash
pip install -r requirements.txt
python app.py
```
If that doesnt work make sure you have a venv 
I used python `3.9` so if your running into version issues try to use python `3.9`

CUDA is optional, but disabled, to enable set `use_cuda=True` in `app.py`

This is an updated and working variation of https://github.com/enlyth/baj-tts/ that is used as an api

Credit to https://github.com/enlyth for training to models

I have also created a docker file in the `backend` if you want to dockerize it, I tested it using google cloud run and it worked perfectly.

# Api 

As i said above the api is set to run on localhost port `8080` here is the example from the `frontend`

try {
      const response = await axios.post('http://localhost:8080/synthesize', {
        text,
        voice: selectedVoice,
      }, {
        responseType: 'blob',
      })
    }

The file output is generated into the `backend` `output` folder and then deleted when the api response is sent.

# Frontend

The frontend is a simple one page nextjs app using nextjs 14.2 and works as is.

# Final notes

If your trying to use this in production add an api key to the code, I didnt do this because im only running it locally.

To run it go into the `backend` and run 

```bash
pip install -r requirements.txt
python app.py
```
Next run the `frontend` by running 

```bash
npm install
npm run dev
```