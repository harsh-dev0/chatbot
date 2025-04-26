"use client"
import React, { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"

const Chat: React.FC = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat()
  const [theme, setTheme] = useState("light")
  const [localError, setLocalError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    setLocalError(null)
    try {
      await handleSubmit(e)
    } catch (err: any) {
      setLocalError(err?.message || "Unknown error")
    }
  }
  const handleReload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    reload()
  }
  const handleStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    stop()
  }
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div
      className={`w-full h-screen bg-${
        theme === "light" ? "gray-100" : "gray-900"
      } text-${theme === "light" ? "black" : "white"} transition-colors duration-200`}
    >
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h1 className="text-xl font-bold">AI Chat</h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Toggle {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded max-w-xl ${
                message.role === "user"
                  ? "ml-auto bg-blue-100 text-blue-900"
                  : "mr-auto bg-gray-200 text-gray-900"
              }`}
            >
              <strong>{message.role === "user" ? "You" : "AI"}:</strong>{" "}
              {message.content}
            </div>
          ))}
          {isLoading && <p className="text-gray-500">AI is typing...</p>}
          <div ref={messagesEndRef} />
        </div>
        {(error || localError) && (
          <div className="flex items-center gap-2 p-2 text-red-500 bg-red-50 border-t border-red-200">
            <span>Error: {error?.message || localError}</span>
            <button onClick={handleReload} className="underline text-xs">Retry</button>
            <button onClick={handleStop} className="underline text-xs">Stop</button>
          </div>
        )}
        <form onSubmit={onSubmit} className="flex p-4 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l bg-gray-100 dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-100"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
