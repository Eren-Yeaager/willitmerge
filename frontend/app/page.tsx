'use client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
export default function Home() {
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const fetchGreeting = async () => {
        setLoading(true)
        try {
            const response = await fetch("http://localhost:3001/api/greeting")
            const data = await response.json()
            setMessage(data.message)
        }
        catch (err) {
            setMessage('Error:Could not connect to backend')

        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
                        Will It Merge ?
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        Turn developer intuition into real-time probabilities.
                        <br />
                        Predict GitHub PR outcomes with prediction markets.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="default" size="lg" onClick={fetchGreeting} disabled={loading}>
                            {loading ? 'Loading...' : "Get Started"}
                        </Button>
                        <Button variant="secondary" size="lg">
                            Learn More
                        </Button>
                    </div>
                    {message && (
                        <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <p className="text-slate-200 text-lg">{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}