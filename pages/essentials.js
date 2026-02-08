// pages/essentials.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Calendar, Volume2 } from 'lucide-react';
import { useRequireAuth } from '@/utils/authGuard';
import { speakGerman } from '@/lib/speechService';

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

const colors = [
  { german: 'rot', english: 'red', example: 'Die Rose ist rot. (The rose is red.)' },
  { german: 'blau', english: 'blue', example: 'Der Himmel ist blau. (The sky is blue.)' },
  { german: 'grün', english: 'green', example: 'Das Gras ist grün. (The grass is green.)' },
  { german: 'gelb', english: 'yellow', example: 'Die Sonne ist gelb. (The sun is yellow.)' },
  { german: 'orange', english: 'orange', example: 'Die Orange ist orange. (The orange is orange.)' },
  { german: 'lila', english: 'purple', example: 'Die Blume ist lila. (The flower is purple.)' },
  { german: 'rosa', english: 'pink', example: 'Das Kleid ist rosa. (The dress is pink.)' },
  { german: 'schwarz', english: 'black', example: 'Die Nacht ist schwarz. (The night is black.)' },
  { german: 'weiß', english: 'white', example: 'Der Schnee ist weiß. (The snow is white.)' },
  { german: 'grau', english: 'gray', example: 'Die Wolke ist grau. (The cloud is gray.)' },
  { german: 'braun', english: 'brown', example: 'Der Baum ist braun. (The tree is brown.)' },
  { german: 'beige', english: 'beige', example: 'Die Wand ist beige. (The wall is beige.)' },
  { german: 'türkis', english: 'turquoise', example: 'Das Meer ist türkis. (The sea is turquoise.)' },
  { german: 'gold', english: 'gold', example: 'Der Ring ist gold. (The ring is gold.)' },
  { german: 'silber', english: 'silver', example: 'Die Münze ist silber. (The coin is silver.)' },
];

const alphabet = [
  { german: 'A', english: 'A', example: 'A wie Apfel (A as in Apple)' },
  { german: 'B', english: 'B', example: 'B wie Buch (B as in Book)' },
  { german: 'C', english: 'C', example: 'C wie Computer (C as in Computer)' },
  { german: 'D', english: 'D', example: 'D wie Deutsch (D as in German)' },
  { german: 'E', english: 'E', example: 'E wie Elefant (E as in Elephant)' },
  { german: 'F', english: 'F', example: 'F wie Fisch (F as in Fish)' },
  { german: 'G', english: 'G', example: 'G wie Garten (G as in Garden)' },
  { german: 'H', english: 'H', example: 'H wie Haus (H as in House)' },
  { german: 'I', english: 'I', example: 'I wie Insel (I as in Island)' },
  { german: 'J', english: 'J', example: 'J wie Jahr (J as in Year)' },
  { german: 'K', english: 'K', example: 'K wie Katze (K as in Cat)' },
  { german: 'L', english: 'L', example: 'L wie Liebe (L as in Love)' },
  { german: 'M', english: 'M', example: 'M wie Mutter (M as in Mother)' },
  { german: 'N', english: 'N', example: 'N wie Nacht (N as in Night)' },
  { german: 'O', english: 'O', example: 'O wie Orange (O as in Orange)' },
  { german: 'P', english: 'P', example: 'P wie Papier (P as in Paper)' },
  { german: 'Q', english: 'Q', example: 'Q wie Qualität (Q as in Quality)' },
  { german: 'R', english: 'R', example: 'R wie Rose (R as in Rose)' },
  { german: 'S', english: 'S', example: 'S wie Sonne (S as in Sun)' },
  { german: 'T', english: 'T', example: 'T wie Tisch (T as in Table)' },
  { german: 'U', english: 'U', example: 'U wie Uhr (U as in Clock)' },
  { german: 'V', english: 'V', example: 'V wie Vogel (V as in Bird)' },
  { german: 'W', english: 'W', example: 'W wie Wasser (W as in Water)' },
  { german: 'X', english: 'X', example: 'X wie Xylophon (X as in Xylophone)' },
  { german: 'Y', english: 'Y', example: 'Y wie Yoga (Y as in Yoga)' },
  { german: 'Z', english: 'Z', example: 'Z wie Zebra (Z as in Zebra)' },
  { german: 'Ä', english: 'Ä', example: 'Ä wie Äpfel (Ä as in Apples)' },
  { german: 'Ö', english: 'Ö', example: 'Ö wie Öl (Ö as in Oil)' },
  { german: 'Ü', english: 'Ü', example: 'Ü wie Über (Ü as in Over)' },
  { german: 'ß', english: 'ß (Eszett)', example: 'ß wie Straße (ß as in Street)' },
];

const seasons = [
  { german: 'Frühling', english: 'Spring', example: 'Im Frühling blühen die Blumen. (In spring, the flowers bloom.)' },
  { german: 'Sommer', english: 'Summer', example: 'Im Sommer ist es warm. (In summer it is warm.)' },
  { german: 'Herbst', english: 'Autumn / Fall', example: 'Im Herbst fallen die Blätter. (In autumn, the leaves fall.)' },
  { german: 'Winter', english: 'Winter', example: 'Im Winter schneit es. (In winter it snows.)' },
];

const bodyParts = [
  { german: 'der Kopf', english: 'the head', example: 'Ich habe Kopfschmerzen. (I have a headache.)' },
  { german: 'das Haar', english: 'the hair', example: 'Sie hat langes Haar. (She has long hair.)' },
  { german: 'das Gesicht', english: 'the face', example: 'Er wäscht sein Gesicht. (He washes his face.)' },
  { german: 'die Stirn', english: 'the forehead', example: 'Sie hat eine hohe Stirn. (She has a high forehead.)' },
  { german: 'das Auge', english: 'the eye', example: 'Ich habe braune Augen. (I have brown eyes.)' },
  { german: 'die Nase', english: 'the nose', example: 'Die Nase ist in der Mitte des Gesichts. (The nose is in the middle of the face.)' },
  { german: 'der Mund', english: 'the mouth', example: 'Er öffnet den Mund. (He opens his mouth.)' },
  { german: 'die Lippe', english: 'the lip', example: 'Sie trägt Lippenstift. (She wears lipstick.)' },
  { german: 'der Zahn', english: 'the tooth', example: 'Ich putze meine Zähne. (I brush my teeth.)' },
  { german: 'die Zunge', english: 'the tongue', example: 'Die Zunge schmeckt. (The tongue tastes.)' },
  { german: 'das Ohr', english: 'the ear', example: 'Ich höre mit den Ohren. (I hear with my ears.)' },
  { german: 'der Hals', english: 'the neck / throat', example: 'Mein Hals tut weh. (My throat hurts.)' },
  { german: 'die Schulter', english: 'the shoulder', example: 'Er trägt eine Tasche auf der Schulter. (He carries a bag on his shoulder.)' },
  { german: 'der Arm', english: 'the arm', example: 'Er hebt den Arm. (He raises his arm.)' },
  { german: 'die Hand', english: 'the hand', example: 'Ich gebe dir die Hand. (I shake your hand.)' },
  { german: 'der Finger', english: 'the finger', example: 'Ich habe zehn Finger. (I have ten fingers.)' },
  { german: 'der Daumen', english: 'the thumb', example: 'Der Daumen ist der größte Finger. (The thumb is the biggest finger.)' },
  { german: 'der Rücken', english: 'the back', example: 'Mein Rücken tut weh. (My back hurts.)' },
  { german: 'die Brust', english: 'the chest / breast', example: 'Er hat Schmerzen in der Brust. (He has pain in his chest.)' },
  { german: 'der Bauch', english: 'the stomach / belly', example: 'Mein Bauch ist voll. (My stomach is full.)' },
  { german: 'die Taille', english: 'the waist', example: 'Sie hat eine schmale Taille. (She has a narrow waist.)' },
  { german: 'das Bein', english: 'the leg', example: 'Ich habe lange Beine. (I have long legs.)' },
  { german: 'das Knie', english: 'the knee', example: 'Mein Knie tut weh. (My knee hurts.)' },
  { german: 'der Fuß', english: 'the foot', example: 'Ich trage Schuhe an den Füßen. (I wear shoes on my feet.)' },
  { german: 'die Zehe', english: 'the toe', example: 'Ich habe zehn Zehen. (I have ten toes.)' },
];

const articleRulesDer = [
  { category: 'Male persons, professions, animals', examples: ['der Mann (the man)', 'der Lehrer (the teacher)', 'der Hund (the dog)'] },
  { category: 'Seasons, months, days of the week', examples: ['der Sommer (the summer)', 'der Januar (January)', 'der Montag (Monday)'] },
  { category: 'Cardinal directions', examples: ['der Norden (the north)', 'der Süden (the south)', 'der Osten (the east)', 'der Westen (the west)'] },
  { category: 'Times of day (except die Nacht)', examples: ['der Morgen (the morning)', 'der Mittag (noon)', 'der Abend (evening)'] },
  { category: 'Weather elements', examples: ['der Regen (the rain)', 'der Schnee (the snow)', 'der Wind (the wind)', 'der Nebel (the fog)'] },
  { category: 'Alcoholic drinks', examples: ['der Wein (the wine)', 'der Whisky (the whisky)', 'der Schnaps (the schnapps)'] },
  { category: 'Nouns ending with -ling, -ismus, -or, -ig, -ich, -ant', examples: ['der Lehrling (apprentice)', 'der Optimismus (optimism)', 'der Motor (motor)', 'der König (king)', 'der Teppich (carpet)', 'der Elefant (elephant)'] },
  { category: 'Languages', examples: ['der Deutsch (German)', 'der Englisch (English)', 'der Französisch (French)'] },
];

const articleRulesDie = [
  { category: 'Female persons, professions, animals', examples: ['die Frau (the woman)', 'die Lehrerin (female teacher)', 'die Katze (the cat)'] },
  { category: 'Words ending with -heit, -keit, -ung, -schaft, -ion, -tät, -ik', examples: ['die Freiheit (freedom)', 'die Geschwindigkeit (speed)', 'die Mannschaft (team)', 'die Universität (university)', 'die Musik (music)', 'die Nation (nation)'] },
  { category: 'Rivers in Germany', examples: ['die Elbe (the Elbe)', 'die Donau (the Danube)', 'die Rhein (the Rhine)'] },
  { category: 'Flowers, trees, plants', examples: ['die Rose (the rose)', 'die Eiche (the oak)', 'die Tulpe (the tulip)'] },
  { category: 'Names of motorcycles, ships, planes', examples: ['die Titanic (the Titanic)', 'die Boeing (the Boeing)'] },
  { category: 'Nouns ending with -ie, -enz/-anz, -ur', examples: ['die Biologie (biology)', 'die Kompetenz (competence)', 'die Distanz (distance)', 'die Natur (nature)'] },
];

const articleRulesDas = [
  { category: 'Diminutives ending in -chen, -lein', examples: ['das Mädchen (the girl)', 'das Fräulein (young lady)', 'das Häuschen (little house)'] },
  { category: 'Words starting with Ge-', examples: ['das Geschenk (the gift)', 'das Gebäude (the building)', 'das Gebiet (the area)', 'das Gelände (the terrain)'] },
  { category: 'Young humans or animals', examples: ['das Kind (the child)', 'das Fohlen (the foal)', 'das Lamm (the lamb)'] },
  { category: 'Metals', examples: ['das Gold (gold)', 'das Silber (silver)', 'das Eisen (iron)'] },
  { category: 'Colors', examples: ['das Blau (blue)', 'das Rot (red)', 'das Grün (green)'] },
  { category: 'Hotels, cafes, cinemas, theaters', examples: ['das Kino (the cinema)', 'das Hotel (the hotel)', 'das Café (the café)', 'das Theater (the theater)'] },
  { category: 'Nouns ending with -um, -ment, -tel, -tum, -ma', examples: ['das Zentrum (center)', 'das Element (element)', 'das Viertel (quarter)', 'das Christentum (Christianity)', 'das Thema (theme)'] },
  { category: 'Infinitives used as nouns', examples: ['das Essen (eating/food)', 'das Trinken (drinking/drink)', 'das Singen (singing)', 'das Schreiben (writing)'] },
];

const personalPronouns = [
  { german: 'ich', english: 'I', example: 'Ich lerne Deutsch. (I learn German.)' },
  { german: 'du', english: 'you (singular, informal)', example: 'Du bist mein Freund. (You are my friend.)' },
  { german: 'er / sie / es', english: 'he / she / it', example: 'Er liest ein Buch. (He reads a book.)' },
  { german: 'wir', english: 'we', example: 'Wir gehen zur Schule. (We go to school.)' },
  { german: 'ihr', english: 'you (plural, informal)', example: 'Ihr seid Studenten. (You are students.)' },
  { german: 'sie', english: 'they', example: 'Sie sprechen Deutsch. (They speak German.)' },
  { german: 'Sie', english: 'you (formal)', example: 'Sie sind sehr nett. (You are very nice.)' },
];

const strongVerbsAtoAe = [
  {
    infinitive: 'schlafen',
    english: 'to sleep',
    conjugations: {
      ich: 'schlafe',
      du: 'schläfst',
      erSieEs: 'schläft',
      wir: 'schlafen',
      ihr: 'schlaft',
      sie: 'schlafen'
    },
    vowelChange: 'a → ä'
  },
  {
    infinitive: 'fahren',
    english: 'to drive',
    conjugations: {
      ich: 'fahre',
      du: 'fährst',
      erSieEs: 'fährt',
      wir: 'fahren',
      ihr: 'fahrt',
      sie: 'fahren'
    },
    vowelChange: 'a → ä'
  },
  {
    infinitive: 'tragen',
    english: 'to carry',
    conjugations: {
      ich: 'trage',
      du: 'trägst',
      erSieEs: 'trägt',
      wir: 'tragen',
      ihr: 'tragt',
      sie: 'tragen'
    },
    vowelChange: 'a → ä'
  },
  {
    infinitive: 'waschen',
    english: 'to wash',
    conjugations: {
      ich: 'wasche',
      du: 'wäschst',
      erSieEs: 'wäscht',
      wir: 'waschen',
      ihr: 'wascht',
      sie: 'waschen'
    },
    vowelChange: 'a → ä'
  },
  {
    infinitive: 'fallen',
    english: 'to fall',
    conjugations: {
      ich: 'falle',
      du: 'fällst',
      erSieEs: 'fällt',
      wir: 'fallen',
      ihr: 'fallt',
      sie: 'fallen'
    },
    vowelChange: 'a → ä'
  },
  {
    infinitive: 'fangen',
    english: 'to catch',
    conjugations: {
      ich: 'fange',
      du: 'fängst',
      erSieEs: 'fängt',
      wir: 'fangen',
      ihr: 'fangt',
      sie: 'fangen'
    },
    vowelChange: 'a → ä'
  },
];

const strongVerbsEtoI = [
  {
    infinitive: 'sprechen',
    english: 'to speak',
    conjugations: {
      ich: 'spreche',
      du: 'sprichst',
      erSieEs: 'spricht',
      wir: 'sprechen',
      ihr: 'sprecht',
      sie: 'sprechen'
    },
    vowelChange: 'e → i'
  },
  {
    infinitive: 'lesen',
    english: 'to read',
    conjugations: {
      ich: 'lese',
      du: 'liest',
      erSieEs: 'liest',
      wir: 'lesen',
      ihr: 'lest',
      sie: 'lesen'
    },
    vowelChange: 'e → ie'
  },
  {
    infinitive: 'essen',
    english: 'to eat',
    conjugations: {
      ich: 'esse',
      du: 'isst',
      erSieEs: 'isst',
      wir: 'essen',
      ihr: 'esst',
      sie: 'essen'
    },
    vowelChange: 'e → i'
  },
];

const strongVerbsOther = [
  {
    infinitive: 'werfen',
    english: 'to throw',
    conjugations: {
      ich: 'werfe',
      du: 'wirfst',
      erSieEs: 'wirft',
      wir: 'werfen',
      ihr: 'werft',
      sie: 'werfen'
    },
    vowelChange: 'e → i'
  },
  {
    infinitive: 'sehen',
    english: 'to see',
    conjugations: {
      ich: 'sehe',
      du: 'siehst',
      erSieEs: 'sieht',
      wir: 'sehen',
      ihr: 'seht',
      sie: 'sehen'
    },
    vowelChange: 'e → ie'
  },
  {
    infinitive: 'geben',
    english: 'to give',
    conjugations: {
      ich: 'gebe',
      du: 'gibst',
      erSieEs: 'gibt',
      wir: 'geben',
      ihr: 'gebt',
      sie: 'geben'
    },
    vowelChange: 'e → i'
  },
  {
    infinitive: 'laufen',
    english: 'to run',
    conjugations: {
      ich: 'laufe',
      du: 'läufst',
      erSieEs: 'läuft',
      wir: 'laufen',
      ihr: 'lauft',
      sie: 'laufen'
    },
    vowelChange: 'au → äu'
  },
];

const fundamentalVerbs = [
  {
    infinitive: 'haben',
    english: 'to have',
    conjugations: {
      ich: 'habe',
      du: 'hast',
      erSieEs: 'hat',
      wir: 'haben',
      ihr: 'habt',
      sie: 'haben'
    },
    highlightColor: 'yellow'
  },
  {
    infinitive: 'sein',
    english: 'to be',
    conjugations: {
      ich: 'bin',
      du: 'bist',
      erSieEs: 'ist',
      wir: 'sind',
      ihr: 'seid',
      sie: 'sind'
    },
    highlightColor: 'green'
  },
  {
    infinitive: 'werden',
    english: 'will / would',
    conjugations: {
      ich: 'werde',
      du: 'wirst',
      erSieEs: 'wird',
      wir: 'werden',
      ihr: 'werdet',
      sie: 'werden'
    },
    highlightColor: 'blue'
  },
];

const sections = [
  { id: 'alphabet', title: 'Alphabet (Alphabet)', items: alphabet },
  { id: 'colors', title: 'Colors (Farben)', items: colors },
  { id: 'numbers', title: 'Numbers (Zahlen)', items: numbers },
  { id: 'seasons', title: 'Seasons (Jahreszeiten)', items: seasons },
  { id: 'months', title: 'Months (Monate)', items: months },
  { id: 'weekdays', title: 'Weekdays (Wochentage)', items: weekdays },
  { id: 'timeExpressions', title: 'Time Expressions (Zeitausdrücke)', items: timeExpressions },
  { id: 'timeFormats', title: 'Telling Time (Uhrzeit)', items: timeFormats },
  { id: 'commonPhrases', title: 'Common Phrases (Häufige Phrasen)', items: commonPhrases },
  { id: 'bodyParts', title: 'Body Parts (Körperteile)', items: bodyParts },
  { id: 'articleRulesDer', title: 'Article Rules: Der (Masculine)', items: articleRulesDer, type: 'articleRules' },
  { id: 'articleRulesDie', title: 'Article Rules: Die (Feminine)', items: articleRulesDie, type: 'articleRules' },
  { id: 'articleRulesDas', title: 'Article Rules: Das (Neuter)', items: articleRulesDas, type: 'articleRules' },
  { id: 'personalPronouns', title: 'Personal Pronouns (Personalpronomen)', items: personalPronouns },
  { id: 'fundamentalVerbs', title: 'Fundamental Verbs (Grundverben)', items: fundamentalVerbs, type: 'verbs' },
  { id: 'strongVerbsAtoAe', title: 'Strong Verbs: a → ä (Starke Verben)', items: strongVerbsAtoAe, type: 'verbs' },
  { id: 'strongVerbsEtoI', title: 'Strong Verbs: e → i/ie (Starke Verben)', items: strongVerbsEtoI, type: 'verbs' },
  { id: 'strongVerbsOther', title: 'Strong Verbs: Other (Starke Verben)', items: strongVerbsOther, type: 'verbs' },
];

const highlightVowelChange = (text, vowelChange) => {
  if (!vowelChange) return text;
  
  // Patterns to match and highlight - using word boundaries to be more precise
  const patterns = {
    'a → ä': /(ä)/g,
    'e → i': /(i)/g,
    'e → ie': /(ie)/g,
    'au → äu': /(äu)/g,
  };
  
  const pattern = patterns[vowelChange];
  if (!pattern) return text;
  
  // Split text and highlight matches
  const parts = [];
  let lastIndex = 0;
  let match;
  const regex = new RegExp(pattern.source, pattern.flags);
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push({ text: text.substring(lastIndex, match.index), highlight: false });
    }
    // Add highlighted match
    parts.push({ text: match[0], highlight: true });
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.substring(lastIndex), highlight: false });
  }
  
  return parts.map((part, index) => {
    if (part.highlight) {
      return (
        <span key={index} className="bg-yellow-300 dark:bg-yellow-700 px-1 rounded font-semibold">
          {part.text}
        </span>
      );
    }
    return <span key={index}>{part.text}</span>;
  });
};

const VerbCard = ({ verb }) => {
  // Determine which forms have vowel changes (du and er/sie/es typically)
  const formsWithChanges = ['du', 'erSieEs'];
  
  // Get highlight color class based on highlightColor
  const getHighlightClass = (color) => {
    switch (color) {
      case 'yellow':
        return 'bg-yellow-300 dark:bg-yellow-700';
      case 'green':
        return 'bg-green-300 dark:bg-green-700';
      case 'blue':
        return 'bg-blue-300 dark:bg-blue-700';
      default:
        return 'bg-yellow-300 dark:bg-yellow-700';
    }
  };
  
  const renderConjugation = (label, value, key) => {
    const hasChange = formsWithChanges.includes(key);
    
    // If highlightColor is provided, highlight the entire conjugation
    if (verb.highlightColor) {
      return (
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{label}:</span>
          <span className={`font-semibold ${getHighlightClass(verb.highlightColor)} px-1 rounded text-gray-800 dark:text-white`}>
            {value}
          </span>
        </div>
      );
    }
    
    // Otherwise, use vowel change highlighting for strong verbs
    return (
      <div className="flex justify-between">
        <span className="text-gray-600 dark:text-gray-400">{label}:</span>
        <span className="font-semibold text-gray-800 dark:text-white">
          {hasChange && verb.vowelChange ? highlightVowelChange(value, verb.vowelChange) : value}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xl font-bold text-gray-800 dark:text-white">{verb.infinitive}</p>
            <button
              onClick={() => speakGerman(verb.infinitive)}
              className="p-1 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-colors"
              title="Pronounce"
            >
              <Volume2 className="w-4 h-4 text-primary-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{verb.english}</p>
          {verb.vowelChange && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">
              {verb.vowelChange}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1 text-sm">
        {renderConjugation('ich', verb.conjugations.ich, 'ich')}
        {renderConjugation('du', verb.conjugations.du, 'du')}
        {renderConjugation('er/sie/es', verb.conjugations.erSieEs, 'erSieEs')}
        {renderConjugation('wir', verb.conjugations.wir, 'wir')}
        {renderConjugation('ihr', verb.conjugations.ihr, 'ihr')}
        {renderConjugation('sie', verb.conjugations.sie, 'sie')}
      </div>
    </div>
  );
};

const ArticleRuleCard = ({ rule }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{rule.category}</h3>
      <div className="space-y-2">
        {rule.examples.map((example, index) => (
          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{example}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SectionCard = ({ id, title, items, type }) => {
  return (
    <div id={id} className="scroll-mt-24 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{title}</h2>
      {type === 'verbs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <VerbCard key={index} verb={item} />
          ))}
        </div>
      ) : type === 'articleRules' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <ArticleRuleCard key={index} rule={item} />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default function Essentials() {
  const { user, checking } = useRequireAuth();
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const sectionRefs = useRef({});

  useEffect(() => {
    // Set initial active section
    if (sections.length > 0) {
      setActiveSection(sections[0].id);
    }

    // Scroll spy to highlight active section
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for sticky tabs

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for sticky tabs
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  };

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
            Learn alphabet, colors, numbers, seasons, months, weekdays, time, common phrases, body parts, article rules, pronouns, and verb conjugations
          </p>
        </div>

        {/* Section Tabs */}
        <div className="sticky top-16 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 mb-6 -mx-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide gap-2 py-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.title.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <SectionCard key={section.id} id={section.id} title={section.title} items={section.items} type={section.type} />
          ))}
        </div>
      </div>
    </>
  );
}