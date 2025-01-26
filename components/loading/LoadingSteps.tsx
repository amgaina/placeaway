import { motion } from 'framer-motion';
import { JSX } from 'react';
import { FaSpinner, FaCheck } from 'react-icons/fa';

type Step = {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
};

export function LoadingSteps({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div className="w-full max-w-md p-8">
      <div className="space-y-8">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className={`flex items-center gap-4 ${
              step.id < currentStep
                ? 'text-green-500'
                : step.id === currentStep
                  ? 'text-sky-500'
                  : 'text-slate-300'
            }`}
            animate={{
              opacity: step.id <= currentStep ? 1 : 0.5,
              y: 0,
            }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-shrink-0">
              {step.id < currentStep ? (
                <FaCheck className="w-6 h-6" />
              ) : step.id === currentStep ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <FaSpinner className="w-6 h-6" />
                </motion.div>
              ) : (
                step.icon
              )}
            </div>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
