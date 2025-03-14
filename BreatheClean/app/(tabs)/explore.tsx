import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Platform, TextInput, View, TouchableOpacity } from 'react-native';

import Collapsible from '@/components/Collapse';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';
import { CheckBox } from '@/components/ui/CheckBox';

type MoodOption = 'great' | 'good' | 'okay' | 'difficult' | 'struggling';
type JournalEntry = {
  id: string;
  date: Date;
  mood: MoodOption | null;
  difficultyLevel: string;
  helpedToday: string;
  additionalThoughts: string;
  shared: boolean;
};

const MOOD_EMOJIS: Record<MoodOption, string> = {
  great: '😁',
  good: '🙂',
  okay: '😐',
  difficult: '😕',
  struggling: '😣'
};

export default function JournalingScreen() {
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    date: new Date(),
    mood: null,
    difficultyLevel: '',
    helpedToday: '',
    additionalThoughts: '',
    shared: true
  });
  
  const [section, setSection] = useState<'journal' | 'pastEntries' | 'partners'>('journal');
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '' });
  
  const saveJournalEntry = () => {
    const newEntry: JournalEntry = {
      ...currentEntry as JournalEntry,
      id: Date.now().toString(),
      date: new Date()
    };
    
    setPastEntries([newEntry, ...pastEntries]);
    
    // Reset form
    setCurrentEntry({
      date: new Date(),
      mood: null,
      difficultyLevel: '',
      helpedToday: '',
      additionalThoughts: '',
      shared: true
    });
    
    // Show feedback (could implement toast notification here)
    alert('Journal entry saved successfully!');
  };
  
  const sendInvitation = () => {
    // Here you would implement actual invitation functionality
    alert(`Invitation sent to ${inviteData.name} at ${inviteData.email}`);
    setShowInviteForm(false);
    setInviteData({ name: '', email: '' });
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D9E5FF', dark: '#2D3047' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#6D8EAF"
          name="heart.text.square"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Vaping Journal</ThemedText>
      </ThemedView>
      
      <ThemedText style={styles.tagline}>
        Track your progress, reflect on your journey, and connect with support partners
      </ThemedText>
      
      <ThemedView style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, section === 'journal' && styles.activeTab]} 
          onPress={() => setSection('journal')}>
          <ThemedText style={section === 'journal' && styles.activeTabText}>Journal</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, section === 'pastEntries' && styles.activeTab]} 
          onPress={() => setSection('pastEntries')}>
          <ThemedText style={section === 'pastEntries' && styles.activeTabText}>Past Entries</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, section === 'partners' && styles.activeTab]} 
          onPress={() => setSection('partners')}>
          <ThemedText style={section === 'partners' && styles.activeTabText}>Partners</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {section === 'journal' && (
        <>
          <Collapsible title="How are you feeling today?" initiallyExpanded={true}>
            <ThemedView style={styles.moodSelector}>
              {(Object.keys(MOOD_EMOJIS) as MoodOption[]).map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    currentEntry.mood === mood && styles.selectedMood
                  ]}
                  onPress={() => setCurrentEntry({...currentEntry, mood})}>
                  <ThemedText style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</ThemedText>
                  <ThemedText style={styles.moodLabel}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </Collapsible>
          
          <Collapsible title="How hard was it to not vape today?" initiallyExpanded={true}>
            <ThemedView style={styles.difficultyContainer}>
              {['1', '2', '3', '4', '5'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    currentEntry.difficultyLevel === level && styles.selectedDifficulty
                  ]}
                  onPress={() => setCurrentEntry({...currentEntry, difficultyLevel: level})}>
                  <ThemedText style={styles.difficultyText}>{level}</ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
            <ThemedText style={styles.difficultyLabel}>
              1 - Easy | 3 - Moderate | 5 - Extremely Difficult
            </ThemedText>
          </Collapsible>
          
          <Collapsible title="What helped you today?">
            <TextInput
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
              value={currentEntry.helpedToday}
              onChangeText={(text) => setCurrentEntry({...currentEntry, helpedToday: text})}
              placeholder="Write about techniques, people, or activities that helped you avoid vaping..."
              placeholderTextColor="#888"
            />
          </Collapsible>
          
          <Collapsible title="Additional thoughts">
            <TextInput
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
              value={currentEntry.additionalThoughts}
              onChangeText={(text) => setCurrentEntry({...currentEntry, additionalThoughts: text})}
              placeholder="Any other reflections, goals, or thoughts for today..."
              placeholderTextColor="#888"
            />
          </Collapsible>
          
          <ThemedView style={styles.shareContainer}>
            <CheckBox
              checked={currentEntry.shared || false}
              onToggle={(checked) => setCurrentEntry({...currentEntry, shared: checked})}
              label="Share with my support partners"
            />
          </ThemedView>
          
          <Button 
            style={styles.saveButton} 
            onPress={saveJournalEntry}
            disabled={!currentEntry.mood || !currentEntry.difficultyLevel}>
            Save Journal Entry
          </Button>
        </>
      )}
      
      {section === 'pastEntries' && (
        <>
          <ThemedText type="sectionTitle">Past Journal Entries</ThemedText>
          
          {pastEntries.length === 0 ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>
                Your past journal entries will appear here
              </ThemedText>
            </ThemedView>
          ) : (
            pastEntries.map(entry => (
              <Collapsible 
                key={entry.id} 
                title={`${new Date(entry.date).toLocaleDateString()} - ${entry.mood} day`}>
                <ThemedView style={styles.entryCard}>
                  <ThemedText style={styles.entryMood}>
                    Feeling: {MOOD_EMOJIS[entry.mood as MoodOption]} {entry.mood}
                  </ThemedText>
                  <ThemedText style={styles.entryDifficulty}>
                    Difficulty level: {entry.difficultyLevel}/5
                  </ThemedText>
                  {entry.helpedToday && (
                    <>
                      <ThemedText style={styles.entryLabel}>What helped:</ThemedText>
                      <ThemedText>{entry.helpedToday}</ThemedText>
                    </>
                  )}
                  {entry.additionalThoughts && (
                    <>
                      <ThemedText style={styles.entryLabel}>Additional thoughts:</ThemedText>
                      <ThemedText>{entry.additionalThoughts}</ThemedText>
                    </>
                  )}
                </ThemedView>
              </Collapsible>
            ))
          )}
        </>
      )}
      
      {section === 'partners' && (
        <>
          <ThemedText type="sectionTitle">Support Partners</ThemedText>
          
          {!showInviteForm ? (
            <Button 
              style={styles.inviteButton}
              onPress={() => setShowInviteForm(true)}>
              Invite New Partner
            </Button>
          ) : (
            <ThemedView style={styles.inviteForm}>
              <ThemedText style={styles.formLabel}>Partner's Name:</ThemedText>
              <TextInput
                style={styles.textInput}
                value={inviteData.name}
                onChangeText={(text) => setInviteData({...inviteData, name: text})}
                placeholder="Enter name"
                placeholderTextColor="#888"
              />
              
              <ThemedText style={styles.formLabel}>Partner's Email:</ThemedText>
              <TextInput
                style={styles.textInput}
                value={inviteData.email}
                onChangeText={(text) => setInviteData({...inviteData, email: text})}
                placeholder="Enter email address"
                placeholderTextColor="#888"
                keyboardType="email-address"
              />
              
              <ThemedView style={styles.inviteActions}>
                <Button 
                  style={styles.cancelButton}
                  variant="secondary"
                  onPress={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
                <Button 
                  style={styles.sendButton}
                  onPress={sendInvitation}
                  disabled={!inviteData.name || !inviteData.email}>
                  Send Invitation
                </Button>
              </ThemedView>
            </ThemedView>
          )}
          
          <ThemedView style={styles.partnersList}>
            <ThemedText style={styles.emptyStateText}>
              Your support partners will appear here
            </ThemedText>
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#6D8EAF',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6D8EAF',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  moodButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    width: '18%',
  },
  selectedMood: {
    backgroundColor: '#D9E5FF',
    borderColor: '#6D8EAF',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 12,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  difficultyButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedDifficulty: {
    backgroundColor: '#D9E5FF',
    borderColor: '#6D8EAF',
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultyLabel: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    color: '#888',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  shareContainer: {
    marginVertical: 20,
  },
  saveButton: {
    marginVertical: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#888',
    textAlign: 'center',
  },
  entryCard: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  entryMood: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  entryDifficulty: {
    marginBottom: 15,
  },
  entryLabel: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  inviteButton: {
    marginBottom: 20,
  },
  inviteForm: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius:8}
  }