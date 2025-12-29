
import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={24} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-500">Thank you for reaching out. Our team will get back to you shortly.</p>
        <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
      </Card>
    );
  }

  return (
    <Card title="Get in Touch" className="max-w-2xl mx-auto">
      <p className="text-slate-500 mb-6">Have a question about the MMIS system? Fill out the form below and we'll help you out.</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" icon={User} placeholder="Your name" required />
          <Input label="Email" icon={Mail} type="email" placeholder="your@email.com" required />
        </div>
        <Input label="Subject" placeholder="How can we help?" required />
        <Input label="Message" multiline icon={MessageSquare} placeholder="Write your message here..." required />
        <Button type="submit" className="w-full mt-4" loading={loading}>
          Send Message
        </Button>
      </form>
    </Card>
  );
};
