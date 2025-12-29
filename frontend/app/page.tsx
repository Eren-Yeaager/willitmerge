'use client'
import { Button } from "@/components/ui/button"
export default function Home() {
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
                        <Button variant="default" size="lg">
                            Get Started
                        </Button>
                        <Button variant="secondary" size="lg">
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}