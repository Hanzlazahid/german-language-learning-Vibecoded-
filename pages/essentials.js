// pages/essentials.js
'use client';

import { useState } from 'react';
import Head from 'next/head';
import { Calendar, Volume2, Search } from 'lucide-react';
import { useRequireAuth } from '@/utils/authGuard';
import { speakGerman } from '@/lib/speechService';
import UmlautToolbar from '@/components/UmlautToolbar';

const months = [
  { german: 'Januar', english: 'January', example: 'Im Januar ist es kalt. (In January it is cold.)' },
  { german: 'Februar', english: 'February', example: 'Der Februar hat 28 Tage. (February has 28 days.)' },
  { german: 'März', english: 'March', example: 'Im März beginnt der Frühling. (Spring begins in March.)' },
  { german: 'April', english: 'April', example: 'Im April regnet es oft. (It often rains in April.)' },
  { german: 'Mai', english: 'May', example: 'Der Mai ist ein schöner Monat. (May is a beautiful month.)' },
  { german: 'Juni', english: 'June', example: 'Im Juni ist es warm. (It is warm in June.)' },
  { german: 'Juli', english: 'July', example: 'Der Juli ist der heißeste Monat. (July is the hottest month.)' },
  { german: 'August', english: 'August', example: 'Im August sind Ferien. (There are holidays in August.)' },
  { german: 'September', english: 'September', example: 'Der September ist der Herbstanfang. (September is the beginning of autumn.)' },
  { german: 'Oktober', english: 'October', example: 'Im Oktober fallen die Blätter. (Leaves fall in October.)' },
  { german: 'November', english: 'November', example: 'Der November ist kalt. (November is cold.)' },
  { german: 'Dezember', english: 'December', example: 'Im Dezember ist Weihnachten. (Christmas is in December.)' },
];

const weekdays = [
  { german: 'Montag', english: 'Monday', example: 'Am Montag beginnt die Woche. (The week begins on Monday.)' },
  { german: 'Dienstag', english: 'Tuesday', example: 'Am Dienstag habe ich Deutschunterricht. (I have German class on Tuesday.)' },
  { german: 'Mittwoch', english: 'Wednesday', example: 'Der Mittwoch ist die Mitte der Woche. (Wednesday is the middle of the week.)' },
  { german: 'Donnerstag', english: 'Thursday', example: 'Am Donnerstag gehe ich einkaufen. (I go shopping on Thursday.)' },
  { german: 'Freitag', english: 'Friday', example: 'Am Freitag ist Wochenende. (It is weekend on Friday.)' },
  { german: 'Samstag', english: 'Saturday', example: 'Am Samstag schlafe ich lange. (I sleep late on Saturday.)' },
  { german: 'Sonntag', english: 'Sunday', example: 'Der Sonntag ist ein Ruhetag. (Sunday is a day of rest.)' },
];

const timeExpressions = [
  { german: 'Morgen', english: 'Morning', example: 'Guten Morgen! (Good morning!)' },
  { german: 'Vormittag', english: 'Forenoon / Late morning', example: 'Am Vormittag arbeite ich. (I work in the late morning.)' },
  { german: 'Mittag', english: 'Noon / Midday', example: 'Zu Mittag esse ich. (I eat at noon.)' },
  { german: 'Nachmittag', english: 'Afternoon', example: 'Am Nachmittag mache ich Sport. (I do sports in the afternoon.)' },
  { german: 'Abend', english: 'Evening', example: 'Am Abend sehe ich fern. (I watch TV in the evening.)' },
  { german: 'Nacht', english: 'Night', example: 'In der Nacht schlafe ich. (I sleep at night.)' },
  { german: 'Mitternacht', english: 'Midnight', example: 'Um Mitternacht ist es dunkel. (It is dark at midnight.)' },
];

const commonPhrases = [
  { german: 'heute', english: 'today', example: 'Heute ist ein schöner Tag. (Today is a beautiful day.)' },
  { german: 'gestern', english: 'yesterday', example: 'Gestern war ich im Kino. (Yesterday I was at the cinema.)' },
  { german: 'morgen', english: 'tomorrow', example: 'Morgen gehe ich zur Schule. (Tomorrow I go to school.)' },
  { german: 'früh', english: 'early', example: 'Ich stehe früh auf. (I get up early.)' },
  { german: 'spät', english: 'late', example: 'Es ist schon spät. (It is already late.)' },
  { german: 'jetzt', english: 'now', example: 'Jetzt lerne ich Deutsch. (Now I am learning German.)' },
];

const timeFormats = [
  {
    german: 'Es ist 9:00 Uhr.',
    english: 'It is 9:00 (24-hour formal)',
    example: 'Es ist neun Uhr. (It is nine o\'clock.)',
    format: '24-hour formal'
  },
  {
    german: 'Es ist 14:30 Uhr.',
    english: 'It is 14:30 (24-hour formal)',
    example: 'Es ist vierzehn Uhr dreißig. (It is fourteen thirty.)',
    format: '24-hour formal'
  },
  {
    german: 'Es ist 23:15 Uhr.',
    english: 'It is 23:15 (24-hour formal)',
    example: 'Es ist dreiundzwanzig Uhr fünfzehn. (It is twenty-three fifteen.)',
    format: '24-hour formal'
  },
  {
    german: 'Es ist 9 Uhr.',
    english: 'It is 9 o\'clock (24-hour informal)',
    example: 'Es ist neun Uhr morgens. (It is nine in the morning.)',
    format: '24-hour informal'
  },
  {
    german: 'Es ist halb drei.',
    english: 'It is half past two (12-hour informal)',
    example: 'Es ist halb drei nachmittags. (It is half past two in the afternoon.)',
    format: '12-hour informal'
  },
  {
    german: 'Es ist Viertel nach zehn.',
    english: 'It is quarter past ten (12-hour informal)',
    example: 'Es ist Viertel nach zehn vormittags. (It is quarter past ten in the morning.)',
    format: '12-hour informal'
  },
  {
    german: 'Es ist Viertel vor acht.',
    english: 'It is quarter to eight (12-hour informal)',
    example: 'Es ist Viertel vor acht abends. (It is quarter to eight in the evening.)',
    format: '12-hour informal'
  },
  {
    german: 'Es ist 2:30 Uhr nachmittags.',
    english: 'It is 2:30 PM (12-hour formal)',
    example: 'Es ist zwei Uhr dreißig nachmittags. (It is two thirty in the afternoon.)',
    format: '12-hour formal'
  },
  {
    german: 'Es ist 10:45 Uhr vormittags.',
    english: 'It is 10:45 AM (12-hour formal)',
    example: 'Es ist zehn Uhr fünfundvierzig vormittags. (It is ten forty-five in the morning.)',
    format: '12-hour formal'
  },
  {
    german: 'Es ist fünf nach sieben.',
    english: 'It is five past seven (12-hour informal)',
    example: 'Es ist fünf nach sieben morgens. (It is five past seven in the morning.)',
    format: '12-hour informal'
  },
  {
    german: 'Es ist zehn vor zwölf.',
    english: 'It is ten to twelve (12-hour informal)',
    example: 'Es ist zehn vor zwölf mittags. (It is ten to twelve at noon.)',
    format: '12-hour informal'
  },
  {
    german: 'Es ist 00:00 Uhr.',
    english: 'It is midnight (24-hour formal)',
    example: 'Es ist Mitternacht. (It is midnight.)',
    format: '24-hour formal'
  },
];

const numbers = [
  { german: 'null', english: 'zero', example: 'Null plus null ist null. (Zero plus zero is zero.)' },
  { german: 'eins', english: 'one', example: 'Ich habe einen Apfel. (I have one apple.)' },
  { german: 'zwei', english: 'two', example: 'Zwei plus zwei ist vier. (Two plus two is four.)' },
  { german: 'drei', english: 'three', example: 'Ich habe drei Bücher. (I have three books.)' },
  { german: 'vier', english: 'four', example: 'Vier Jahreszeiten. (Four seasons.)' },
  { german: 'fünf', english: 'five', example: 'Fünf Finger an einer Hand. (Five fingers on one hand.)' },
  { german: 'sechs', english: 'six', example: 'Sechs Tage in der Woche. (Six days in the week.)' },
  { german: 'sieben', english: 'seven', example: 'Sieben Tage in der Woche. (Seven days in the week.)' },
  { german: 'acht', english: 'eight', example: 'Acht Stunden Schlaf. (Eight hours of sleep.)' },
  { german: 'neun', english: 'nine', example: 'Neun Planeten. (Nine planets.)' },
  { german: 'zehn', english: 'ten', example: 'Zehn Finger. (Ten fingers.)' },
  { german: 'elf', english: 'eleven', example: 'Elf Uhr. (Eleven o\'clock.)' },
  { german: 'zwölf', english: 'twelve', example: 'Zwölf Monate im Jahr. (Twelve months in a year.)' },
  { german: 'dreizehn', english: 'thirteen', example: 'Ich bin dreizehn Jahre alt. (I am thirteen years old.)' },
  { german: 'vierzehn', english: 'fourteen', example: 'Vierzehn Tage sind zwei Wochen. (Fourteen days are two weeks.)' },
  { german: 'fünfzehn', english: 'fifteen', example: 'Fünfzehn Minuten. (Fifteen minutes.)' },
  { german: 'sechzehn', english: 'sixteen', example: 'Mit sechzehn darf man Auto fahren. (At sixteen you can drive a car.)' },
  { german: 'siebzehn', english: 'seventeen', example: 'Siebzehn Jahre alt. (Seventeen years old.)' },
  { german: 'achtzehn', english: 'eighteen', example: 'Mit achtzehn ist man volljährig. (At eighteen you are of age.)' },
  { german: 'neunzehn', english: 'nineteen', example: 'Neunzehn Uhr. (Nineteen o\'clock / 7 PM.)' },
  { german: 'zwanzig', english: 'twenty', example: 'Zwanzig Euro. (Twenty euros.)' },
  { german: 'dreißig', english: 'thirty', example: 'Dreißig Minuten sind eine halbe Stunde. (Thirty minutes is half an hour.)' },
  { german: 'vierzig', english: 'forty', example: 'Vierzig Jahre alt. (Forty years old.)' },
  { german: 'fünfzig', english: 'fifty', example: 'Fünfzig Prozent. (Fifty percent.)' },
  { german: 'sechzig', english: 'sixty', example: 'Sechzig Sekunden sind eine Minute. (Sixty seconds are one minute.)' },
  { german: 'siebzig', english: 'seventy', example: 'Siebzig Jahre alt. (Seventy years old.)' },
  { german: 'achtzig', english: 'eighty', example: 'Achtzig Prozent. (Eighty percent.)' },
  { german: 'neunzig', english: 'ninety', example: 'Neunzig Grad. (Ninety degrees.)' },
  { german: 'hundert', english: 'one hundred', example: 'Hundert Jahre sind ein Jahrhundert. (One hundred years is a century.)' },
];

const sections = [
  { id: 'months', title: 'Months (Monate)', items: months },
  { id: 'weekdays', title: 'Weekdays (Wochentage)', items: weekdays },
  { id: 'timeExpressions', title: 'Time Expressions (Zeitausdrücke)', items: timeExpressions },
  { id: 'timeFormats', title: 'Telling Time (Uhrzeit)', items: timeFormats },
  { id: 'numbers', title: 'Numbers (Zahlen)', items: numbers },
  { id: 'commonPhrases', title: 'Common Phrases (Häufige Phrasen)', items: commonPhrases },
];

const SectionCard = ({ title, items }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{item.german}</p>
                  <button
                    onClick={() => speakGerman(item.german)}
                    className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-colors"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4 text-primary-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.english}</p>
                  {item.format && (
                    <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded">
                      {item.format}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">{item.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Essentials() {
  const { user, checking } = useRequireAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInputRef, setSearchInputRef] = useState(null);

  if (checking || !user) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          {checking ? 'Checking session...' : 'Redirecting to login...'}
        </p>
      </div>
    );
  }

  const filteredSections = sections.filter((section) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      section.title.toLowerCase().includes(searchLower) ||
      section.items.some(
        (item) =>
          item.german.toLowerCase().includes(searchLower) ||
          item.english.toLowerCase().includes(searchLower)
      )
    );
  });

  return (
    <>
      <Head>
        <title>German Learning App - Essentials</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            <Calendar className="w-10 h-10 text-primary-600" />
            <span>Essentials</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Learn months, weekdays, time, numbers, and common phrases
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={setSearchInputRef}
              type="text"
              placeholder="Search by section name (e.g., Months, Numbers, Time)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          {searchInputRef && <UmlautToolbar targetRef={searchInputRef} />}
        </div>

        {filteredSections.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No sections found matching "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredSections.map((section) => (
              <SectionCard key={section.id} title={section.title} items={section.items} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

