import axios from 'axios';
import { RealtimeSession } from '@openai/agents-realtime';
import { jethalalVoiceAgent } from '../agent/jethalal.js';

function App() {

  const session = new RealtimeSession(jethalalVoiceAgent,
    {
      model: 'gpt-realtime'
    }
  )


  const startVoiceAgent = async () => {
    try {
      console.log('Generating key...')
      const response = await axios.post('https://api.openai.com/v1/realtime/client_secrets', {
        "session": {
          "type": "realtime",
          "model": "gpt-realtime"
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        }
      })

      const epKey = response.data.value;

      await session.connect({ apiKey: epKey });

    } catch (error) {
      console.error('error starting agent...');
      console.log(`Error: ${error}`)
    }
  }

  const endVoiceAgent = async () => {
    try {
      session.close();
    } catch (error) {
      console.error('error ending agent...');
      console.log(`Error: ${error}`)
    }
  }

  return (
    <>
      <div className="App">Hello World</div>
      <button onClick={startVoiceAgent} className='m-4 bg-blue-400 p-3 rounded-md'>
        Start Talking
      </button>


      <button onClick={endVoiceAgent} className='m-4 bg-blue-400 p-3 rounded-md'>
        Stop
      </button>
    </>
  )
}

export default App
