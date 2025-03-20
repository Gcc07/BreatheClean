import { View, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResourcesScreen() {
  const openEmail = () => {
    Linking.openURL('mailto:cttsprogram@duke.edu');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Quit Vaping Resources</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Tools and support to help you succeed</ThemedText>
        </View>

        <ThemedView style={styles.resourceSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <ThemedText style={styles.sectionTitle}>Programs That Work</ThemedText>
          </View>

          <View style={styles.resourceItem}>
            <View style={styles.resourceTitleContainer}>
              <ThemedText style={styles.resourceTitle}>Duke TTS Program</ThemedText>
              <View style={styles.recommendedBadge}>
                <ThemedText style={styles.recommendedText}>Recommended</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.resourceDescription}>
              Tobacco Treatment Specialists who have specialized training to help you quit. Contact: {' '}
              <ThemedText style={styles.emailLink} onPress={openEmail}>
                cttsprogram@duke.edu
              </ThemedText>
            </ThemedText>
          </View>

          <View style={styles.resourceItem}>
            <ThemedText style={styles.resourceTitle}>Skip the Vape</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              A program specifically designed for teens looking to quit vaping.
            </ThemedText>
          </View>

          <View style={styles.resourceItem}>
            <ThemedText style={styles.resourceTitle}>Quit the Hit</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Resources for teens and young adults wanting to quit vaping.
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.resourceSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <ThemedText style={styles.sectionTitle}>Why Quitting is Hard</ThemedText>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statCircle}>
              <ThemedText style={styles.statNumber}>3%</ThemedText>
            </View>
            <ThemedText style={styles.statDescription}>
              Success rate when quitting "cold turkey" without support
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.infoText}>
              Flavored vapes, especially menthol, are designed to be extremely addictive.
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText style={styles.infoText}>
              Vapes are relatively new, so long-term effects are still being studied.
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={styles.resourceSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <ThemedText style={styles.sectionTitle}>Effective Strategies</ThemedText>
          </View>

          <View style={styles.resourceItem}>
            <ThemedText style={styles.resourceTitle}>Nicotine Replacement Therapy</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Options like patches, gum, and lozenges can help manage cravings.
            </ThemedText>
          </View>

          <View style={styles.resourceItem}>
            <ThemedText style={styles.resourceTitle}>Medication Options</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Prescription medications like Ranoclin and Bupropion can help reduce cravings and withdrawal symptoms.
            </ThemedText>
          </View>

          <View style={styles.resourceItem}>
            <ThemedText style={styles.resourceTitle}>Oral Nicotine Resources</ThemedText>
            <ThemedText style={styles.resourceDescription}>
              Alternatives that can help manage cravings while breaking the habit.
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1E1E1E', // Dark header background
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BBBBBB',
  },
  resourceSection: {
    backgroundColor: '#1E1E1E', // Dark section background
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#4CAF85', // Keeping the green accent
    borderRadius: 2,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resourceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  resourceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  recommendedBadge: {
    backgroundColor: '#4CAF85', // Keeping the green accent
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  resourceDescription: {
    color: '#BBBBBB',
    lineHeight: 20,
  },
  emailLink: {
    color: '#4DA8DA',
    textDecorationLine: 'underline',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C', // Darker background for contrast
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#4CAF85', // Keeping the green accent
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statDescription: {
    flex: 1,
    fontSize: 14,
    color: '#BBBBBB',
  },
  infoItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  infoText: {
    color: '#BBBBBB',
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    height: 50,
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
  },
});
