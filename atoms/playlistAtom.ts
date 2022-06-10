const { atom } = require('recoil');

export const playlistIdState = atom({
    key: 'playlistIdState',
    default: 'Home',
});

export const playlistAtom = atom({
    key: 'playlistAtom',    
    default: null,
});

export const playlistsAtom = atom({
    key: 'playlistsAtom',
    default: [],
});