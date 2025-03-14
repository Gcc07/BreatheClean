import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const App = () => {
  const [daysSober, setDaysSober] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [streakHistory, setStreakHistory] = useState<{ days: number; date: string }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const dailyUsageCost = 0.5; // Example cost per day
  const goalDays = 30; // Set a goal for full progress

  // Animated values
  const progressAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);
  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: daysSober / goalDays,
      duration: 800,
      useNativeDriver: false,
    }).start();

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
    if (daysSober > 0 && daysSober % 5 === 0) {
      setShowConfetti(true);
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setShowConfetti(false);
          bounceAnim.setValue(0);
        }, 3000);
      });
    }
  }, [daysSober]);

  const getAvatarStateImage = () => {
    if (daysSober === 0) {
      return require('@/assets/images/bronchii.gif');
    } else if (daysSober < 10) {
      return require('@/assets/images/bronchii.gif'); // Use your slightly improved image here
    } else if (daysSober < 20) {
      return require('@/assets/images/bronchii.gif'); // Use your moderately improved image here
    } else {
      return require('@/assets/images/bronchii.gif'); // Use your healthy image here
    }
  };

  const handleVaped = () => {
    // Add current streak to history before resetting
    if (daysSober > 0) {
      setStreakHistory([...streakHistory, { days: daysSober, date: new Date().toLocaleDateString() }]);
    }
    setDaysSober(0);
    setMoneySaved(Math.max(0, moneySaved - dailyUsageCost));
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
    } else {
      return "Thriving";
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
    } else {
      return "30 days! You've reached your goal!";
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
          <Text style={styles.goalText}>{`${daysSober}/${goalDays} days`}</Text>
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
          <View style={styles.avatarInner}>
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
              </View>
            )}
          </View>
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
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  statusContainer: {
    marginTop: 25,
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
  },
  avatarInner: {
    backgroundColor: '#FFF',
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 140,
    height: 140,
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
});

export default App;