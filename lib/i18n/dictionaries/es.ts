import type { en } from './en';

export const es: typeof en = {
  header: {
    selectLanguage: 'Seleccionar idioma',
  },
  footer: {
    craftedBy: 'Creado por',
    viewOnGithub: 'Ver en GitHub',
  },
  home: {
    hero: {
      title: 'Encuentra tu próxima estadía entre paredes con historia',
      subtitle: 'Alojamientos únicos dentro de edificios históricos por Europa.',
    },
    search: {
      destinationLabel: 'Destino',
      destinationPlaceholder: 'Ej: Praga, Ámsterdam...',
      clearDestination: 'Borrar destino',
      datesLabel: 'Fechas',
      datesPlaceholder: 'Seleccionar fechas',
      guestsLabel: 'Huéspedes',
      guestsCount: (count: number) => `${count} ${count === 1 ? 'huésped' : 'huéspedes'}`,
      decreaseGuests: 'Disminuir número de huéspedes',
      increaseGuests: 'Aumentar número de huéspedes',
      searchButton: 'Buscar',
    },
    popularDestinations: {
      title: 'Destinos más buscados',
      subtitle: 'Nuestros destinos históricos más visitados.',
    },
  },
};
