'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'


const voices = [
  { name: "xqc", model: "xqc.pth" },
  { name: "juice-wrld", model: "juice-wrld.pth" },
  { name: "trump", model: "trump.pth" },
  { name: "forsen", model: "forsen.pth" },
  { name: "obiwan", model: "obiwan.pth" },
  { name: "david", model: "david.pth" }
]

export default function TTSTestPage() {
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(voices[0].name)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAudioUrl(null)

    try {
      const response = await axios.post('http://localhost:8080/synthesize', {
        text,
        voice: selectedVoice,
      }, {
        responseType: 'blob',
      })

      const url = URL.createObjectURL(response.data)
      setAudioUrl(url)
    } catch (error) {
      console.error('Error generating audio:', error)
      alert('Failed to generate audio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Text To Speech</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to synthesize"
          className="w-full"
          required
        />
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Generating...' : 'Generate Audio'}
        </Button>
      </form>
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  )
}