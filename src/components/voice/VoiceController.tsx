import React, { useState, useEffect, useCallback } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface VoiceControllerProps {
  onStateSelect?: (stateName: string) => void;
  onQuickAction?: (action: string) => void;
}

export function VoiceController({ onStateSelect, onQuickAction }: VoiceControllerProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: t('listening'),
          description: t('speak_command'),
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };
      
      setRecognition(recognitionInstance);
    }

    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, [i18n.language]);

  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command:', command);
    
    // Navigation commands
    if (command.includes('dashboard') || command.includes('डैशबोर्ड')) {
      navigate('/dashboard');
      speak(t('dashboard'));
    } else if (command.includes('alerts') || command.includes('अलर्ट')) {
      navigate('/alerts');
      speak(t('alerts'));
    } else if (command.includes('reports') || command.includes('रिपोर्ट')) {
      navigate('/reports');
      speak(t('reports'));
    } else if (command.includes('awareness') || command.includes('जागरूकता')) {
      navigate('/awareness');
      speak(t('awareness'));
    }
    
    // State selection commands
    else if (command.includes('assam') || command.includes('असम')) {
      onStateSelect?.('assam');
      speak(`${t('assam')} selected`);
    } else if (command.includes('manipur') || command.includes('मणिपुर')) {
      onStateSelect?.('manipur');
      speak(`${t('manipur')} selected`);
    } else if (command.includes('meghalaya') || command.includes('मेघालय')) {
      onStateSelect?.('meghalaya');
      speak(`${t('meghalaya')} selected`);
    } else if (command.includes('mizoram') || command.includes('मिजोरम')) {
      onStateSelect?.('mizoram');
      speak(`${t('mizoram')} selected`);
    } else if (command.includes('nagaland') || command.includes('नागालैंड')) {
      onStateSelect?.('nagaland');
      speak(`${t('nagaland')} selected`);
    } else if (command.includes('sikkim') || command.includes('सिक्किम')) {
      onStateSelect?.('sikkim');
      speak(`${t('sikkim')} selected`);
    } else if (command.includes('tripura') || command.includes('त्रिपुरा')) {
      onStateSelect?.('tripura');
      speak(`${t('tripura')} selected`);
    }
    
    // Action commands
    else if (command.includes('send alert') || command.includes('अलर्ट भेजें')) {
      onQuickAction?.('send_alert');
      speak('Alert sent successfully');
    } else if (command.includes('assign doctor') || command.includes('डॉक्टर असाइन')) {
      onQuickAction?.('assign_doctor');
      speak('Doctor assigned');
    } else if (command.includes('generate report') || command.includes('रिपोर्ट जेनरेट')) {
      onQuickAction?.('generate_report');
      speak('Report generated');
    } else if (command.includes('refresh') || command.includes('रीफ्रेश')) {
      onQuickAction?.('refresh');
      speak('Data refreshed');
    }
    
    // Language switching
    else if (command.includes('hindi') || command.includes('हिंदी')) {
      i18n.changeLanguage('hi');
      speak('भाषा हिंदी में बदल गई');
    } else if (command.includes('english') || command.includes('अंग्रेजी')) {
      i18n.changeLanguage('en');
      speak('Language changed to English');
    } else if (command.includes('assamese') || command.includes('অসমীয়া')) {
      i18n.changeLanguage('as');
      speak('ভাষা অসমীয়ালৈ সলনি কৰা হ\'ল');
    }
    
    else {
      speak('Command not recognized. Please try again.');
    }
  }, [navigate, onStateSelect, onQuickAction, i18n, t]);

  const speak = useCallback((text: string) => {
    if (!synthesis) return;
    
    // Cancel any ongoing speech
    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesis.speak(utterance);
  }, [synthesis, i18n.language]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking && synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={!recognition}
        className="flex items-center space-x-2"
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        <span className="hidden sm:inline">
          {isListening ? t('listening') : t('voice_control')}
        </span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSpeech}
        disabled={!synthesis}
        className="flex items-center space-x-2"
      >
        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}