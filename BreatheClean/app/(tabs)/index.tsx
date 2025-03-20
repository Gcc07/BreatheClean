import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const App = () => {
  const [daysSober, setDaysSober] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [streakHistory, setStreakHistory] = useState<{ days: number; date: string }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const dailyUsageCost = 0.5; // Example cost per day
  const [currentGoal, setCurrentGoal] = useState(30); // Initial goal
  const [goalLevel, setGoalLevel] = useState(1); // Track which goal level the user is on

  // Animated values
  const progressAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);
  const bounceAnim = new Animated.Value(0);

  // Update progress bar whenever daysSober changes
  useEffect(() => {
    // Always animate progress bar when days change
    Animated.timing(progressAnim, {
      toValue: Math.min(daysSober / currentGoal, 1), // Cap at 1 (100%)
      duration: 800,
      useNativeDriver: false,
    }).start();

    // Check if goal is reached and update to a new goal
    if (daysSober > 0 && daysSober % 30 === 0) {
      // Increase goal after current one is completed
      const newGoalLevel = Math.floor(daysSober / 30) + 1;
      if (newGoalLevel > goalLevel) {
        setGoalLevel(newGoalLevel);
        setCurrentGoal(30 * newGoalLevel); // Increase goal by 30 days each time
        
        // Extra celebration for reaching a goal and moving to next level
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000); // Longer celebration for reaching a goal
      }
    }
  }, [daysSober]);

  // Handle milestone animations separately
  useEffect(() => {
    // Breathing animation for avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Milestone celebrations
    if (daysSober > 0 && (daysSober % 5 === 0 || daysSober % 30 === 0)) {
      setShowConfetti(true);
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          if (!(daysSober % 30 === 0)) { // Keep confetti longer for 30-day milestones
            setShowConfetti(false);
          }
          bounceAnim.setValue(0);
        }, 3000);
      });
    }
  }, [daysSober]);

  const getAvatarStateImage = () => {
    if (daysSober === 0) {
      return require('@/assets/images/bronchii.gif');
    } else if (daysSober < 10) {
      return require('@/assets/images/bronchii.gif'); 
    } else if (daysSober < 20) {
      return require('@/assets/images/bronchii.gif'); 
    } else {
      return require('@/assets/images/bronchii.gif'); 
    }
  };

  const handleVaped = () => {
    // Add current streak to history before resetting
    if (daysSober > 0) {
      setStreakHistory([...streakHistory, { days: daysSober, date: new Date().toLocaleDateString() }]);
    }
    setDaysSober(0);
    setMoneySaved(Math.max(0, moneySaved - dailyUsageCost));
    
    // Reset to initial goal when streak is broken
    setCurrentGoal(30);
    setGoalLevel(1);
  };

  const handleDidNotVape = () => {
    setDaysSober(daysSober + 1);
    setMoneySaved(moneySaved + dailyUsageCost);
  };

  // Calculate health status and motivation message
  const getHealthStatus = () => {
    if (daysSober < 7) {
      return "Getting Started";
    } else if (daysSober < 14) {
      return "Recovering";
    } else if (daysSober < 21) {
      return "Improving";
    } else if (daysSober < 60) {
      return "Thriving";
    } else if (daysSober < 90) {
      return "Champion";
    } else {
      return "Vape-Free Master";
    }
  };

  const getMotivationMessage = () => {
    if (daysSober === 0) {
      return "Start your journey today!";
    } else if (daysSober < 3) {
      return "The first days are the hardest. Keep going!";
    } else if (daysSober < 7) {
      return "Almost a week! Your lungs are thanking you.";
    } else if (daysSober < 14) {
      return "Amazing progress! Your circulation is improving.";
    } else if (daysSober < 30) {
      return "You're building a new, healthier you!";
    } else if (daysSober === 30) {
      return "Congratulations! You've reached your first goal of 30 days!";
    } else if (daysSober % 30 === 0) {
      return `Amazing! You've reached ${daysSober} days! New goal set to ${currentGoal}!`;
    } else if (daysSober < 60) {
      return "Keep going! You're well on your way to your 60-day goal!";
    } else if (daysSober < 90) {
      return "Outstanding dedication! Your body is thanking you!";
    } else {
      return "You're a vape-free champion! Keep setting new records!";
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          {/* Header with streak and savings */}
          <View style={styles.header}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#FFF" />
              <Text style={styles.statValue}>{daysSober}</Text>
              <Text style={styles.statLabel}>Days Free</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cash" size={24} color="#FFF" />
              <Text style={styles.statValue}>${moneySaved.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>

          {/* Goal Level Indicator */}
          <View style={styles.goalLevelContainer}>
            <Text style={styles.goalLevelText}>Goal Level: {goalLevel}</Text>
            <Text style={styles.goalLevelDescription}>
              {`Current target: ${currentGoal} days`}
            </Text>
          </View>

          {/* Status and motivation */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{getHealthStatus()}</Text>
            <Text style={styles.motivationText}>{getMotivationMessage()}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { width: progressWidth }
              ]} 
            />
            <View style={styles.goalMarker} />
            <Text style={styles.goalText}>{`${daysSober}/${currentGoal} days`}</Text>
          </View>

          {/* Avatar */}
          <Animated.View 
            style={[
              styles.avatarContainer,
              { 
                transform: [
                  { scale: pulseAnim },
                  { translateY: bounceAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, -20, 0],
                  })},
                ]
              }
            ]}
          >
            <Image
              source={getAvatarStateImage()}
              style={styles.avatarImage}
              resizeMode="contain"
            />
            {showConfetti && (
              <View style={styles.confetti}>
                <MaterialCommunityIcons name="party-popper" size={36} color="#FFD700" style={styles.confettiIcon} />
                <MaterialCommunityIcons name="party-popper" size={36} color="#FF6B6B" style={[styles.confettiIcon, { top: 10, left: 50 }]} />
                <MaterialCommunityIcons name="party-popper" size={36} color="#4ECDC4" style={[styles.confettiIcon, { bottom: 20, right: 30 }]} />
                {daysSober % 30 === 0 && (
                  <>
                    <MaterialCommunityIcons name="trophy" size={40} color="#FFD700" style={[styles.confettiIcon, { top: -30, right: 10 }]} />
                    <MaterialCommunityIcons name="party-popper" size={36} color="#9370DB" style={[styles.confettiIcon, { bottom: 40, left: 10 }]} />
                    <MaterialCommunityIcons name="party-popper" size={36} color="#32CD32" style={[styles.confettiIcon, { top: 30, right: 50 }]} />
                  </>
                )}
              </View>
            )}
            <Text style={styles.avatarText}>Bronchi</Text>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.didntVapeButton} 
              onPress={handleDidNotVape}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00b09b', '#96c93d']}
                style={styles.buttonGradient}
              >
                <MaterialCommunityIcons name="check-circle" size={24} color="#FFF" />
                <Text style={styles.buttonText}>I Didn't Vape Today</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.vapedButton} 
              onPress={handleVaped}
              activeOpacity={0.8}
            >
              <View style={styles.buttonInner}>
                <MaterialCommunityIcons name="close-circle" size={24} color="#FFF" />
                <Text style={styles.buttonText}>I Vaped Today</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Previous streaks */}
          {streakHistory.length > 0 && (
            <View style={styles.streakHistoryContainer}>
              <Text style={styles.streakHistoryTitle}>Previous Streaks</Text>
              <View style={styles.streakList}>
                {streakHistory.slice(-3).map((streak, index) => (
                  <View key={index} style={styles.streakItem}>
                    <Text style={styles.streakDays}>{streak.days} days</Text>
                    <Text style={styles.streakDate}>{streak.date}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30, // Extra padding at bottom
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    width: width * 0.4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  goalLevelContainer: {
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 10,
  },
  goalLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  goalLevelDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  statusContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 20,
  },
  progressContainer: {
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 25,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
  },
  goalMarker: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#FFD700',
  },
  goalText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    top: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  avatarImage: {
    width: 180,
    height: 180,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  confetti: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  confettiIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  buttonsContainer: {
    marginTop: 10,
  },
  didntVapeButton: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  vapedButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 50
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  streakHistoryContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 50,
  },
  streakHistoryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  streakList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  streakDays: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  bottomPadding: {
    height: 20, // Extra space at the bottom
  },
});

export default App;