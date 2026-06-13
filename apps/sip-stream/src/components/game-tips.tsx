'use client';

import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';

interface GameTipsProps {
  gameType: string;
}

const gameTips = {
  'kings-cup': [
    'Ace: Waterfall - Everyone drinks until the person to your right stops!',
    '2: You - Pick someone to drink',
    '3: Me - You drink',
    '4: Floor - Last person to touch the floor drinks',
    '5: Guys - All guys drink',
    '6: Chicks - All girls drink',
    '7: Heaven - Last person to point up drinks',
    '8: Mate - Pick a mate, they drink when you drink',
    '9: Rhyme - Say a word, everyone must rhyme or drink',
    '10: Categories - Pick a category, everyone names something or drinks',
    'Jack: Never Have I Ever - Play a round',
    'Queen: Question Master - Ask questions, anyone who answers drinks',
    'King: Make a rule - Create a rule that lasts until the next king',
    '💡 Tip: The last king makes the rule that everyone drinks!',
    '💡 Tip: Keep track of your mate - they drink every time you do!',
    '💡 Tip: Be creative with your rules - make them fun but fair!',
    '💡 Tip: The Question Master can ask ANY question!',
    '💡 Tip: Categories can be anything - movies, food, countries!',
  ],
  'never-have-i-ever': [
    'Start with "Never have I ever..." and finish the statement',
    'Anyone who HAS done it takes a drink',
    'Be honest - lying defeats the purpose!',
    'Keep it fun and lighthearted',
    "Don't make statements too personal or embarrassing",
    '💡 Tip: Start with easy statements to warm up the group',
    '💡 Tip: Mix in some funny and some serious statements',
    '💡 Tip: Pay attention to who drinks - you might learn something!',
    '💡 Tip: Keep track of interesting revelations for later conversations',
    "💡 Tip: Don't pressure anyone to share details if they don't want to",
  ],
  'custom-deck': [
    'Create your own rules and challenges',
    'Perfect for inside jokes and group traditions',
    "Make rules that fit your group's personality",
    '💡 Tip: Write down your best custom rules for future games',
    "💡 Tip: Consider your group's comfort level when making rules",
    '💡 Tip: Mix fun challenges with drinking rules',
    '💡 Tip: Get creative - the more unique, the more memorable!',
    '💡 Tip: Remember the best custom rules often become group traditions',
  ],
};

export function GameTips({ gameType }: GameTipsProps) {
  const [currentTip, setCurrentTip] = useState('');
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const tips = gameTips[gameType as keyof typeof gameTips] || gameTips['kings-cup'];
    setCurrentTip(tips[0]);
    setTipIndex(0);
  }, [gameType]);

  useEffect(() => {
    const tips = gameTips[gameType as keyof typeof gameTips] || gameTips['kings-cup'];

    const interval = setInterval(() => {
      setTipIndex(prev => {
        const newIndex = (prev + 1) % tips.length;
        setCurrentTip(tips[newIndex]);
        return newIndex;
      });
    }, 8000); // Change tip every 8 seconds

    return () => clearInterval(interval);
  }, [gameType]);

  const tips = gameTips[gameType as keyof typeof gameTips] || gameTips['kings-cup'];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-10">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <i className="pi pi-lightbulb text-orange-500 text-xl"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-800 mb-1">Game Tip</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{currentTip}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex gap-1">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === tipIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
