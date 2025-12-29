
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PaymentGatewayProps {
  amount: number;
  itemDescription: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentGateway = ({ amount, itemDescription, onSuccess, onCancel }: PaymentGatewayProps) => {
  const [step, setStep] = useState<'DETAILS' | 'PROCESSING' | 'SUCCESS'>('DETAILS');
  const [method, setMethod] = useState<'CARD' | 'PAYPAL' | 'MOBILE_MONEY'>('CARD');

  const handlePay = async () => {
    setStep('PROCESSING');
    await new Promise(r => setTimeout(r, 3000));
    setStep('SUCCESS');
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  if (step === 'PROCESSING') {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-12">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900">Processing Payment</h2>
          <p className="text-slate-500 mt-2">Securing your transaction with bank-grade encryption...</p>
        </Card>
      </div>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center py-12">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Successful!</h2>
          <p className="text-slate-500 mt-2">Your dues have been cleared. Redirecting you back...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in my-auto">
        
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-indigo-600 text-white h-full">
            <div className="flex items-center gap-2 mb-8 opacity-80 uppercase text-[10px] font-bold tracking-widest">
              <ShieldCheck size={14} /> Secure Checkout
            </div>
            <h3 className="text-xl font-bold mb-1">Payment for {itemDescription}</h3>
            <p className="text-indigo-100 text-sm">MMIS Billing System</p>
            
            <div className="mt-12 space-y-4">
              <div className="flex justify-between border-b border-indigo-500 pb-2">
                <span className="text-sm opacity-80">Subtotal</span>
                <span className="font-mono">UGX {amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-500 pb-2">
                <span className="text-sm opacity-80">Platform Fee</span>
                <span className="font-mono">UGX 0</span>
              </div>
              <div className="flex justify-between pt-4">
                <span className="text-lg font-bold">Total Due</span>
                <span className="text-2xl font-black">UGX {amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-auto pt-12 text-[10px] opacity-60 leading-relaxed">
              By completing this payment, you agree to MMIS financial terms and regional tax regulations. 
              Refunds are subject to city-level admin review.
            </div>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Select Payment Method</h3>
            
            <div className="flex gap-3 mb-8">
              {[
                { id: 'CARD', label: 'Card', icon: CreditCard },
                { id: 'PAYPAL', label: 'PayPal', icon: CreditCard },
                { id: 'MOBILE_MONEY', label: 'M-Money', icon: CreditCard },
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    method === m.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <m.icon size={24} />
                  <span className="text-xs font-bold">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <Input label="Cardholder Name" placeholder="JOHN DOE" icon={Lock} />
              <Input label="Card Number" placeholder="**** **** **** ****" icon={CreditCard} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVV" placeholder="***" type="password" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mt-8 flex gap-3">
              <AlertCircle className="text-slate-400 shrink-0" />
              <p className="text-[10px] text-slate-500 font-medium">
                Your transaction is protected by 256-bit SSL encryption. We do not store your full card details in our local database.
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
              <Button className="flex-[2] py-4" onClick={handlePay}>
                Pay UGX {amount.toLocaleString()} <ArrowRight size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
