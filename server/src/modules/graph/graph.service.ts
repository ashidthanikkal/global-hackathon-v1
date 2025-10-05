// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import OpenAI from 'openai';

// @Injectable()
// export class GraphService {
//   private openai: OpenAI;

//   constructor() {
//     this.openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//   }

//   async generateGraph(inputText: string) {
//     try {
//       const prompt = `
//       Extract key concepts and their relationships from this text.
//       Return JSON strictly in this format:
//       {
//         "nodes": [{"id": "Concept1"}, {"id": "Concept2"}],
//         "edges": [{"source": "Concept1", "target": "Concept2", "relation": "depends_on"}]
//       }

//       Text:
//       ${inputText}
//       `;

//       const response = await this.openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//       });

//       const content = response.choices[0].message.content;
//       console.log('🧠 GPT Response:', content);

//       try {
//         return JSON.parse(content || '{}');
//       } catch (err) {
//         console.error('❌ JSON Parse Error:', err);
//         throw new InternalServerErrorException('Invalid JSON returned by GPT');
//       }
//     } catch (error) {
//       console.error('🔥 OpenAI API Error:', error);
//       throw new InternalServerErrorException(error.message || 'OpenAI error');
//     }
//   }

// }

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GraphService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

async generateGraph(inputText: string) {
  try {
    const prompt = `
Extract key concepts and their relationships from this text.
Return JSON strictly in this format:
{
  "nodes": [{"id": "Concept1"}, {"id": "Concept2"}],
  "edges": [{"source": "Concept1", "target": "Concept2", "relation": "depends_on"}]
}

Text:
${inputText}
    `;

    const response = await this.ai.models.generateContent({
      model: 'models/gemini-2.5-flash-lite',
      contents: prompt,
    });

    const content = response.text;
    console.log('🧠 Gemini Response:', content);

    // Extract JSON block
    const match = content?.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new InternalServerErrorException(
        'Invalid JSON returned by Google Gemini',
      );
    }

    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (error) {
    console.error('🔥 Google Gemini API Error:', error);
    throw new InternalServerErrorException(
      error.message || 'Google Gemini error',
    );
  }
}

}
