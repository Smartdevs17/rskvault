import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Contact {
  name: string;
  address: string;
}

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
}

const ContactsContext = createContext<ContactsContextType>({
  contacts: [],
  addContact: () => {},
});

export const useContacts = () => useContext(ContactsContext);

export const ContactsProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load contacts from storage on mount
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const saved = await AsyncStorage.getItem('contacts');
        if (saved) setContacts(JSON.parse(saved));
      } catch (err) {
        setContacts([]);
      }
    };
    loadContacts();
  }, []);

  // Save contacts to storage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact: Contact) => {
    // Prevent duplicates
    if (contacts.some(c => c.address.toLowerCase() === contact.address.toLowerCase())) return;
    setContacts([...contacts, contact]);
  };

  return (
    <ContactsContext.Provider value={{ contacts, addContact }}>
      {children}
    </ContactsContext.Provider>
  );
};