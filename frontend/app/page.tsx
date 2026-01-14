'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Market {
    id: number;
    prUrl: string;
    question: string;
    endTime: string;
    status: string;
    createdAt: string;
}

export default function Home() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        prUrl: '',
        question: '',
        endTime: ''
    })
    const [submitting, setSubmitting] = useState(false)


    useEffect(() => {
        fetchMarkets();
    }, []);

    const fetchMarkets = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/markets');
            const data = await response.json();
            setMarkets(data.markets || []);
        } catch (error) {
            console.error('Error fetching markets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const response = await fetch('http://localhost:3001/api/markets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prUrl: formData.prUrl,
                    question: formData.question,
                    endTime: formData.endTime
                })
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to create market')
            }
            setIsOpen(false)
            setFormData({ prUrl: '', question: '', endTime: '' })
            await fetchMarkets()
        } catch (error: any) {
            console.error('Error creating market:', error)
            alert(error.message || 'Failed to create market')
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-16">

                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
                        Will It Merge?
                    </h1>
                    <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                        Turn developer intuition into real-time probabilities.
                        <br />
                        Predict GitHub PR outcomes with prediction markets.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" size="lg">
                                    Create Market
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Market</DialogTitle>
                                    <DialogDescription>
                                        Create a prediction market for a GitHub PR
                                    </DialogDescription>

                                </DialogHeader>
                                <form onSubmit={handleSubmit} className='space-y-6'>
                                    <div>
                                        <Label htmlFor='prUrl'>PR URL</Label>
                                        <Input id="prUrl" type="url" placeholder="https://github.com/owner/repo/pull/123" value={formData.prUrl} onChange={(e) => setFormData({ ...formData, prUrl: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor='question'>Question</Label>
                                        <Input id='question' type='text' placeholder='Will this PR merge within 48 hours?' value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} required />
                                    </div>
                                    <div>
                                        <Label htmlFor='endTime'>
                                            End Time
                                        </Label>
                                        <Input id="endTime"
                                            type='datetime-local'
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
                                    </div>
                                    <div>
                                        <div className='flex justify-end gap-2'>
                                            <Button type='button' variant="secondary" onClick={() => setIsOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button type='submit' disabled={submitting}>{submitting ? 'Creating' : "Create Market"}</Button>
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button variant="secondary" size="lg">
                            Learn More
                        </Button>
                    </div>
                </div>


                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-8">Active Markets</h2>

                    {loading ? (
                        <div className="text-center text-slate-400">Loading markets...</div>
                    ) : markets.length === 0 ? (
                        <div className="text-center text-slate-400">No markets yet. Create one to get started!</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {markets.map((market) => (
                                <div
                                    key={market.id}
                                    className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 hover:border-purple-500 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${market.status === 'open'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {market.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {market.question}
                                    </h3>

                                    <a
                                        href={market.prUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-400 hover:text-purple-300 text-sm mb-4 block truncate"
                                    >
                                        {market.prUrl}
                                    </a>

                                    <div className="text-sm text-slate-400">
                                        <p>Ends: {new Date(market.endTime).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}