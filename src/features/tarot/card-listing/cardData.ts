import { COURT_CARDS } from '@/lib/tarot/card-utils';

export interface MajorArcanaCard {
  key: string;
  number: number;
}

export interface MinorArcanaCard {
  key: string;
  suit: 'Cups' | 'Pentacles' | 'Swords' | 'Wands';
  number: string;
}

export const MAJOR_ARCANA_CARDS: MajorArcanaCard[] = [
  { key: 'the-fool', number: 0 },
  { key: 'the-magician', number: 1 },
  { key: 'the-high-priestess', number: 2 },
  { key: 'the-empress', number: 3 },
  { key: 'the-emperor', number: 4 },
  { key: 'the-hierophant', number: 5 },
  { key: 'the-lovers', number: 6 },
  { key: 'the-chariot', number: 7 },
  { key: 'strength', number: 8 },
  { key: 'the-hermit', number: 9 },
  { key: 'wheeloffortune', number: 10 },
  { key: 'justice', number: 11 },
  { key: 'the-hanged-man', number: 12 },
  { key: 'death', number: 13 },
  { key: 'temperance', number: 14 },
  { key: 'the-devil', number: 15 },
  { key: 'the-tower', number: 16 },
  { key: 'the-star', number: 17 },
  { key: 'the-moon', number: 18 },
  { key: 'the-sun', number: 19 },
  { key: 'Judgement', number: 20 },
  { key: 'the-world', number: 21 },
];

const MINOR_SUITS: Array<MinorArcanaCard['suit']> = [
  'Cups',
  'Pentacles',
  'Swords',
  'Wands',
];

export const MINOR_ARCANA_CARDS: MinorArcanaCard[] = MINOR_SUITS.flatMap(
  suit => {
    const cards: MinorArcanaCard[] = [];

    for (let number = 1; number <= 14; number++) {
      if (
        number === COURT_CARDS.PAGE ||
        number === COURT_CARDS.KNIGHT ||
        number === COURT_CARDS.QUEEN ||
        number === COURT_CARDS.KING
      ) {
        continue;
      }

      cards.push({
        key: `${getCardNumberKey(number)}-of-${suit.toLowerCase()}`,
        suit,
        number: getCardNumberLabel(number),
      });
    }

    cards.push(
      { key: `knight-of-${suit.toLowerCase()}`, suit, number: 'Knight' },
      { key: `queen-of-${suit.toLowerCase()}`, suit, number: 'Queen' },
      { key: `king-of-${suit.toLowerCase()}`, suit, number: 'King' }
    );

    return cards;
  }
);

function getCardNumberKey(number: number): string {
  switch (number) {
    case 1:
      return 'ace';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
    case 6:
      return 'six';
    case 7:
      return 'seven';
    case 8:
      return 'eight';
    case 9:
      return 'nine';
    case 10:
      return 'ten';
    default:
      return 'page';
  }
}

function getCardNumberLabel(number: number): string {
  switch (number) {
    case 1:
      return 'Ace';
    case 2:
      return 'Two';
    case 3:
      return 'Three';
    case 4:
      return 'Four';
    case 5:
      return 'Five';
    case 6:
      return 'Six';
    case 7:
      return 'Seven';
    case 8:
      return 'Eight';
    case 9:
      return 'Nine';
    case 10:
      return 'Ten';
    default:
      return 'Page';
  }
}
