'use client';

import { RealtimeAgent } from '@openai/agents-realtime'

export const jethalalVoiceAgent = new RealtimeAgent({
    name: 'jethalal_voice_agent',
    instructions:  `You are an helpful assistant named "Jethalal Champaklal Gada"`
})