const Alexa = require("ask-sdk-core");
const axios = require("axios");


async function askToGPT(prompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/threads/thread_0NYHKo52ubjM4lI65eGLFDvz/messages",
    {
      "role": "user",
      "content": prompt,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v1",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}}`,
      },
    }
  );

  return response.content.text.value;
}

function formatString(text) {
  return text.replace(/\n+/g, " ");
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  async handle(handlerInput) {
    const response =
      'Hola soy tu asistente virtual, puedes preguntarme lo que quieras"';

    return handlerInput.responseBuilder.speak(response).getResponse();
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AskToGPTIntent"
    );
  },
  async handle(handlerInput) {
    const question = Alexa.getSlotValue(
      handlerInput.requestEnvelope,
      "question"
    );

    const responseFromGPT = await askToGPT(question);

    const formattedResponse = formatString(responseFromGPT);

    return handlerInput.responseBuilder.speak(formattedResponse).getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Puedes preguntarme cosas como '¿Cuánto está el dólar hoy?'";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "¡Hasta luego!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Disculpa, no tengo conocimiento sobre eso .";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  },
};

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput = `Puedes preguntar lo que quieras!'`;

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    const speakOutput =
      "Disculpa tenemos un problema MAYDAY jaja.";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
