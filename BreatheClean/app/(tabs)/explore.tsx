import { StyleSheet, ScrollView, Platform, TextInput, View, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';

import Collapsible from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';
import { CheckBox } from '@/components/ui/CheckBox';


// Types
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

// Constants
const MOOD_EMOJIS: Record<MoodOption, string> = {
  great: '😁',
  good: '🙂',
  okay: '😐',
  difficult: '😕',
  struggling: '😣'
};

const COLORS = {
  primary: '#4F7CAC',
  secondary: '#6A98D0',
  accent: '#FF6B6B',
  background: {
    light: '#EDF2F7',
    dark: '#1E2132',
  },
  card: {
    light: 'rgba(255, 255, 255, 0.9)',
    dark: 'rgba(45, 55, 75, 0.8)',
  },
  text: {
    light: '#2D3748',
    dark: '#E2E8F0',
  }
};

const MOOD_GRADIENTS = {
  great: ['#36D1DC', '#5B86E5'],
  good: ['#56CCF2', '#2F80ED'],
  okay: ['#A1A1A1', '#7E7E7E'],
  difficult: ['#F2994A', '#F2C94C'],
  struggling: ['#FF5E62', '#FF9966'],
};

const { width: screenWidth } = Dimensions.get('window');
const iconSize = screenWidth * 0.1;

export default function JournalingScreen() {
  // State
  const [progressAnim] = useState(new Animated.Value(0));
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    date: new Date(),
    mood: null,
    difficultyLevel: '',
    helpedToday: '',
    additionalThoughts: '',
    shared: true
  });
  const [section, setSection] = useState<'journal' | 'pastEntries'>('journal');
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ name: '', email: '' });
  
  // Functions
  const calculateProgress = () => {
    let steps = 0;
    if (currentEntry.mood) steps++;
    if (currentEntry.difficultyLevel) steps++;
    if (currentEntry.helpedToday && currentEntry.helpedToday.length > 0) steps++;
    return steps / 3;
  };
  useEffect(() => {
    const progress = calculateProgress();
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false // Width animations can't use native driver
    }).start();
  }, [currentEntry]);
  useEffect(() => {
    const handleDimensionChange = () => {
      // Force a re-render when dimensions change
      setCurrentEntry({...currentEntry});
    };
    
    const subscription = Dimensions.addEventListener('change', handleDimensionChange);
    
    return () => subscription?.remove();
  }, [currentEntry]);
  
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
  
  const getFormattedDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const now = new Date();
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  };
  
  
  // UI Components
  const renderJournalSection = () => (
    <ThemedView style={styles.journalContainer}>
    <Collapsible 
      title="How are you feeling today?" 
      initiallyExpanded={true}
      iconName="face.smiling">
      <View style={styles.moodSelector}>
        {(Object.keys(MOOD_EMOJIS) as MoodOption[]).map((mood) => (
          <TouchableOpacity
            key={mood}
            onPress={() => setCurrentEntry({...currentEntry, mood})}>
            <LinearGradient
              colors={currentEntry.mood === mood ? MOOD_GRADIENTS[mood] : ['transparent', 'transparent']}
              style={[
                styles.moodButton,
                currentEntry.mood === mood ? styles.selectedMood : styles.unselectedMood
              ]}>
              <ThemedText style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </Collapsible>
      
      <Collapsible 
        title="Difficulty level today?" 
        initiallyExpanded={true}
        iconName="arrow.up.and.down">
        <ThemedText style={styles.difficultyPrompt}>
          How difficult was it to avoid vaping today?
        </ThemedText>
        <View style={styles.difficultyContainer}>
          {['1', '2', '3', '4', '5'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                currentEntry.difficultyLevel === level && styles.selectedDifficulty
              ]}
              onPress={() => setCurrentEntry({...currentEntry, difficultyLevel: level})}>
              <LinearGradient
                colors={
                  currentEntry.difficultyLevel === level 
                    ? ['#4F7CAC', '#6A98D0'] 
                    : ['transparent', 'transparent']
                }
                style={styles.difficultyGradient}>
                <ThemedText style={[
                  styles.difficultyText,
                  currentEntry.difficultyLevel === level && styles.selectedDifficultyText
                ]}>
                  {level}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        <ThemedText style={styles.difficultyLabel}>
          1 - Easy | 3 - Moderate | 5 - Extremely Difficult
        </ThemedText>
      </Collapsible>
      
      <Collapsible 
        title="What helped you today?" 
        iconName="lightbulb">
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={4}
          value={currentEntry.helpedToday}
          onChangeText={(text) => setCurrentEntry({...currentEntry, helpedToday: text})}
          placeholder="Write about techniques, people, or activities that helped you avoid vaping..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </Collapsible>
      
      <Collapsible 
        title="Additional thoughts" 
        iconName="bubble.left.and.bubble.right">
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={4}
          value={currentEntry.additionalThoughts}
          onChangeText={(text) => setCurrentEntry({...currentEntry, additionalThoughts: text})}
          placeholder="Any other reflections, goals, or thoughts for today..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </Collapsible>
      
      <TouchableOpacity
        style={[
          styles.saveButton, 
          (!currentEntry.mood || !currentEntry.difficultyLevel) && styles.disabledButton
        ]}
        onPress={() => {
          if (currentEntry.mood && currentEntry.difficultyLevel) {
            saveJournalEntry();
          }
        }}
        disabled={!currentEntry.mood || !currentEntry.difficultyLevel}>
        <LinearGradient
          colors={['#5B86E5', '#36D1DC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveButtonGradient}>
          <ThemedText style={styles.saveButtonText}>Save Journal Entry</ThemedText>
          <IconSymbol name="arrow.right" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );

  const renderPastEntriesSection = () => (
    <ThemedView style={styles.pastEntriesContainer}>
      <View style={styles.pastEntriesHeader}>
        <ThemedText type="title" style={styles.pastEntriesTitle}>Your Journal History</ThemedText>
        {pastEntries.length > 0 && (
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol name="line.3.horizontal.decrease.circle" size={22} color={COLORS.primary} />
            <ThemedText style={styles.filterText}>Filter</ThemedText>
          </TouchableOpacity>
        )}
      </View>
      
      {pastEntries.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="book.closed" size={50} color="rgba(255, 255, 255, 0.3)" />
          <ThemedText style={styles.emptyStateText}>
            Your journal is empty
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            Start tracking your journey by creating your first entry
          </ThemedText>
        </ThemedView>
      ) : (
        pastEntries.map(entry => (
          <BlurView
            key={entry.id}
            intensity={80}
            tint="dark"
            style={styles.entryCardContainer}>
            <View style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <ThemedText style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </ThemedText>
                <View style={styles.entryMoodBadge}>
                  <ThemedText style={styles.entryMoodEmoji}>
                    {MOOD_EMOJIS[entry.mood as MoodOption]}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.entryDifficultyContainer}>
                <ThemedText style={styles.entryDifficultyLabel}>
                  Difficulty:
                </ThemedText>
                <View style={styles.entryDifficultyBars}>
                  {[1, 2, 3, 4, 5].map(level => (
                    <View 
                      key={level} 
                      style={[
                        styles.difficultyBar,
                        parseInt(entry.difficultyLevel) >= level && styles.activeDifficultyBar
                      ]} 
                    />
                  ))}
                </View>
                <ThemedText style={styles.entryDifficultyText}>
                  {entry.difficultyLevel}/5
                </ThemedText>
              </View>
              
              {entry.helpedToday && (
                <View style={styles.entrySection}>
                  <ThemedText style={styles.entrySectionTitle}>What helped:</ThemedText>
                  <ThemedText style={styles.entrySectionContent}>{entry.helpedToday}</ThemedText>
                </View>
              )}
              
              {entry.additionalThoughts && (
                <View style={styles.entrySection}>
                  <ThemedText style={styles.entrySectionTitle}>Additional thoughts:</ThemedText>
                  <ThemedText style={styles.entrySectionContent}>{entry.additionalThoughts}</ThemedText>
                </View>
              )}
            </View>
          </BlurView>
        ))
      )}
    </ThemedView>
  );
  
  // Main Render
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#4F7CAC', dark: '#2D3047' }}
      headerImage={
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.headerGradient}>
          <IconSymbol
            size={200}
            color="rgba(255, 255, 255, 0.85)"
            name="heart.text.square.fill"
            style={styles.headerImage}
          />
        </LinearGradient>
      }>
      {/* Header Section */}
      <ThemedView style={styles.titleContainer}>
        <View style={styles.titleLeftSection}>
          <IconSymbol name="lungs" size={24} color={COLORS.accent} />
          <ThemedText type="title" style={styles.title}>My Journal</ThemedText>
        </View>
      </ThemedView>
      
      <ThemedText style={styles.dateText}>{getFormattedDate()}</ThemedText>
      
      <ThemedText style={styles.tagline}>
        Track your progress, reflect on your journey
      </ThemedText>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]} 
        />
        <ThemedText style={styles.progressText}>
          Journal {Math.round(calculateProgress() * 100)}% complete
        </ThemedText>
      </View>
      
      {/* Tab Navigation */}
      <ThemedView style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabButton, section === 'journal' && styles.activeTab]} 
          onPress={() => setSection('journal')}>
          <IconSymbol 
            name="pencil.line" 
            size={20} 
            color={section === 'journal' ? "#FFF" : COLORS.primary} 
          />
          <ThemedText style={[styles.tabText, section === 'journal' && styles.activeTabText]}>
            Journal
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, section === 'pastEntries' && styles.activeTab]} 
          onPress={() => setSection('pastEntries')}>
          <IconSymbol 
            name="calendar" 
            size={20} 
            color={section === 'pastEntries' ? "#FFF" : COLORS.primary} 
          />
          <ThemedText style={[styles.tabText, section === 'pastEntries' && styles.activeTabText]}>
            Past Entries
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      {/* Content Sections */}
      {section === 'journal' ? renderJournalSection() : renderPastEntriesSection()}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  headerImage: {
    opacity: 0.9,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  titleLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
  },
  tagline: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  journalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.00)',
    borderRadius: 12,
    padding: 4,
    paddingHorizontal: 4, 
    marginBottom: 400,
    marginHorizontal: 0,
    justifyContent: 'space-evenly',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Changed from space-between
    alignItems: 'center',
    marginBottom: 12,
    marginEnd: 24,
    paddingHorizontal: 0,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: 'hidden',
  },
  moodEmoji: {
    lineHeight: 50,
    fontSize: 20,
    textAlign: 'center',
  },
  unselectedMood: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedMood: {
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedMoodText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  difficultyPrompt: {
    textAlign: 'center',
    marginRight: 24,
    marginBottom: 12,
    marginTop: 8,
    fontSize: 16,
  },
  difficultyContainer: {
    //backgroundColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Changed from space-between
    alignItems: 'center',
    marginVertical: 0,
    marginEnd: 24,
    paddingHorizontal: 0,
    minHeight: 60, // Add minimum height to ensure enough space
  },
  difficultyButton: {
    width: 50, // Explicit width
    height: 50, // Explicit height
    overflow: 'hidden',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 0,
    // Removed shadow properties as they might cause layout issues
  },
  difficultyGradient: {
    width: '100%', // Use percentage instead of fixed width
    height: '100%', // Use percentage instead of fixed height
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center', // Ensure text is centered
    includeFontPadding: false, // Android specific fix for text padding
    textAlignVertical: 'center', // Android specific
  },
  selectedDifficulty: {
    borderWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0,
    shadowRadius: 20,
  },
  selectedDifficultyText: {
    color: '#FFF',
  },
  difficultyLabel: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
    marginEnd: 24,
    marginBottom:10,
    color: 'rgba(255, 255, 255, 0.7)',

  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    marginEnd: 24,
    marginBottom: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pastEntriesContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 4,
  },
  pastEntriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pastEntriesTitle: {
    fontSize: 22,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 12,
  },
  emptyStateText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyStateSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontSize: 14,
  },
  entryCardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  entryCard: {
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  entryMoodBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryMoodEmoji: {
    fontSize: 24,
    lineHeight: 40,
  },
  entryDifficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  entryDifficultyLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 10,
  },
  entryDifficultyBars: {
    flexDirection: 'row',
    flex: 1,
    gap: 4,
    minWidth: 150,
    maxWidth: 200,
  },
  difficultyBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  activeDifficultyBar: {
    backgroundColor: COLORS.accent,
  },
  entryDifficultyText: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  entrySection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  entrySectionTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  entrySectionContent: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  shareContainer: {
    marginTop: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },


});

