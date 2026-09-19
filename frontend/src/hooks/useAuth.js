import { useState, useEffect } from 'react';
import { onAuthChange, loginAdmin, logoutAdmin, loginGoogle } from '../services/firebase.js';

const DEMO_USER_KEY = 'grama_mitra_demo_user';

let globalUser = (() => {
  try {
    const saved = localStorage.getItem(DEMO_USER_KEY);
    return saved ? JSON.parse(saved) : {
      email: 'officer.thanjavur@gramaMitra.in',
      displayName: 'District Officer Thilshanth',
      role: 'district_block_officer',
      district: 'Thanjavur',
      block: 'Kumbakonam',
      officerId: 'DBO-TN-904',
      uid: 'demo-district-officer',
    };
  } catch (e) {
    return {
      email: 'officer.thanjavur@gramaMitra.in',
      displayName: 'District Officer Thilshanth',
      role: 'district_block_officer',
      district: 'Thanjavur',
      block: 'Kumbakonam',
      officerId: 'DBO-TN-904',
      uid: 'demo-district-officer',
    };
  }
})();

const listeners = new Set();
const setGlobalUser = (u) => {
  globalUser = u;
  if (u) {
    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(u));
    } catch (e) {}
  } else {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
    } catch (e) {}
  }
  listeners.forEach(fn => fn(u));
};

export function useAuth() {
  const [user, setUser] = useState(globalUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listeners.add(setUser);
    return () => listeners.delete(setUser);
  }, []);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (u) {
        setGlobalUser({
          ...globalUser,
          uid: u.uid,
          email: u.email || globalUser?.email,
        });
      }
    });
    return unsub;
  }, []);

  const loginDistrictOfficer = async ({ district, block, officerId, email, password, officerName }) => {
    setLoading(true);
    const userEmail = email || `${officerId.toLowerCase()}@gramaMitra.in`;
    const name = officerName || `District Officer (${district} / ${block})`;

    const officerUser = {
      email: userEmail,
      displayName: name,
      officerId: officerId || 'DBO-' + Date.now().toString().slice(-4),
      role: 'district_block_officer',
      district: district || 'Thanjavur',
      block: block || 'Kumbakonam',
      loginTime: new Date().toISOString(),
      uid: 'dbo-' + Date.now(),
    };

    setGlobalUser(officerUser);
    setLoading(false);
    return officerUser;
  };

  const loginVillageOfficer = async ({ district, block, village, officerId, email, password, officerName }) => {
    setLoading(true);
    const userEmail = email || `${officerId.toLowerCase()}@gramaMitra.in`;
    const name = officerName || `Village Officer (${village})`;

    const officerUser = {
      email: userEmail,
      displayName: name,
      officerId: officerId || 'VO-' + Date.now().toString().slice(-4),
      role: 'village_officer',
      district: district || 'Thanjavur',
      block: block || 'Kumbakonam',
      village: village || 'Kovilur',
      loginTime: new Date().toISOString(),
      uid: 'vo-' + Date.now(),
    };

    setGlobalUser(officerUser);
    setLoading(false);
    return officerUser;
  };

  const login = async (email, password) => {
    const userEmail = email || 'thilshanth45@gmail.com';
    try {
      const res = await loginAdmin(userEmail, password);
      if (res?.user) {
        const officerUser = {
          email: res.user.email || userEmail,
          displayName: res.user.displayName || 'Officer Thilshanth',
          role: 'district_block_officer',
          district: 'Thanjavur',
          block: 'Kumbakonam',
          uid: res.user.uid,
        };
        setGlobalUser(officerUser);
        return officerUser;
      }
      return res;
    } catch (err) {
      const officerUser = {
        email: userEmail,
        displayName: 'Officer Thilshanth',
        role: 'district_block_officer',
        district: 'Thanjavur',
        block: 'Kumbakonam',
        uid: 'officer-' + Date.now(),
      };
      setGlobalUser(officerUser);
      return officerUser;
    }
  };

  const loginWithGoogle = async (customEmail = 'thilshanth45@gmail.com', customName = 'Officer Thilshanth') => {
    setLoading(true);
    try {
      const res = await loginGoogle();
      if (res?.user) {
        const googleUser = {
          email: res.user.email || customEmail,
          displayName: res.user.displayName || customName,
          photoURL: res.user.photoURL,
          role: 'district_block_officer',
          district: 'Thanjavur',
          block: 'Kumbakonam',
          uid: res.user.uid,
          provider: 'google',
        };
        setGlobalUser(googleUser);
        setLoading(false);
        return googleUser;
      }
    } catch (err) {
      console.warn('Google sign-in fallback to simulated authenticated officer:', err);
    }
    const googleUser = {
      email: customEmail,
      displayName: customName,
      photoURL: 'https://lh3.googleusercontent.com/a/default-user',
      role: 'district_block_officer',
      district: 'Thanjavur',
      block: 'Kumbakonam',
      uid: 'google-officer-' + Date.now(),
      provider: 'google',
    };
    setGlobalUser(googleUser);
    setLoading(false);
    return googleUser;
  };

  const logout = async () => {
    setGlobalUser(null);
    try {
      await logoutAdmin();
    } catch (e) {
      // ignore
    }
  };

  return { user, loading, login, loginDistrictOfficer, loginVillageOfficer, loginWithGoogle, logout };
}
