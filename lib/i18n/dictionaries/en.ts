export const en = {
  header: {
    selectLanguage: 'Select language',
  },
  footer: {
    craftedBy: 'Crafted by',
    viewOnGithub: 'View on GitHub',
  },
  home: {
    hero: {
      title: 'Find your next stay inside a piece of history',
      subtitle: 'Unique stays inside historic buildings across Europe.',
    },
    search: {
      destinationLabel: 'Destination',
      destinationPlaceholder: 'e.g. Prague, Amsterdam...',
      clearDestination: 'Clear destination',
      datesLabel: 'Dates',
      datesPlaceholder: 'Select dates',
      guestsLabel: 'Guests',
      guestsCount: (count: number) => `${count} ${count === 1 ? 'guest' : 'guests'}`,
      decreaseGuests: 'Decrease number of guests',
      increaseGuests: 'Increase number of guests',
      searchButton: 'Search',
    },
    popularDestinations: {
      title: 'Most searched destinations',
      subtitle: 'Our most visited historic destinations.',
    },
  },
};
