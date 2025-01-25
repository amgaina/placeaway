'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AuthenticationFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  console.log({
    email,
    code,
    password,
  });

  const handleNextStep = () => {
    if (step === 1 && !email) {
      setError('Please enter your email');
      return;
    } else if (step === 2 && !code) {
      setError('Please enter the verification code');
      return;
    } else if (step === 3 && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        {/* Step Indicator */}
        <div className="flex justify-between mb-4">
          <div
            className={`w-1/3 py-2 text-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md`}
          >
            Step 1
          </div>
          <div
            className={`w-1/3 py-2 text-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md`}
          >
            Step 2
          </div>
          <div
            className={`w-1/3 py-2 text-center ${step === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} rounded-md`}
          >
            Step 3
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <h2 className="text-2xl font-bold text-center mb-4">
              Enter Your Email
            </h2>
            <Input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 className="text-2xl font-bold text-center mb-4">
              Enter Verification Code
            </h2>
            <Input
              placeholder="Verification Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Card>
        )}

        {step === 3 && (
          <Card>
            <h2 className="text-2xl font-bold text-center mb-4">
              Set Your New Password
            </h2>
            <Input
              placeholder="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mt-4">
            {error}
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="w-1/2"
            >
              Back
            </Button>
          )}
          <Button onClick={handleNextStep} className="w-1/2">
            {step === 3 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
