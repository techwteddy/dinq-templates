'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const tiers = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    yearlyPrice: '$0',
    description: 'Perfect for getting started.',
    features: [
      'Access to 5 free courses',
      'Basic community support',
      'Public profile',
      'Course completion certificates',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    monthlyPrice: '$19',
    yearlyPrice: '$15',
    description: 'Most popular for serious learners.',
    features: [
      'Unlimited access to all courses',
      'Priority support',
      'Exclusive workshops',
      'Ad-free experience',
      'Offline viewing',
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    yearlyPrice: 'Custom',
    description: 'For teams and organizations.',
    features: [
      'Everything in Pro',
      'Custom learning paths',
      'Dedicated account manager',
      'Team analytics dashboard',
      'Single Sign-On (SSO)',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="container space-y-16 py-10">
      <section className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-6xl">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Invest in your future with our flexible plans. No hidden fees.
        </p>
      </section>

      <div className="flex items-center justify-center space-x-4">
        <Label
          htmlFor="billing-toggle"
          className={!isYearly ? 'font-bold' : 'text-muted-foreground'}
        >
          Monthly
        </Label>
        <Checkbox
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={(checked) => setIsYearly(checked as boolean)}
          className="h-6 w-11 rounded-full border-2 border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        />
        <Label
          htmlFor="billing-toggle"
          className={isYearly ? 'font-bold' : 'text-muted-foreground'}
        >
          Yearly{' '}
          <span className="text-xs font-normal text-primary">(Save 20%)</span>
        </Label>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={
              tier.popular
                ? 'relative z-10 scale-105 border-primary shadow-lg'
                : 'relative'
            }
          >
            {tier.popular && (
              <Badge
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1"
                variant="default"
              >
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  {isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                </span>
                {tier.monthlyPrice !== 'Custom' && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              <ul className="space-y-3 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Icons.check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.buttonVariant}>
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
