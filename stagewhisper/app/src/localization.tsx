// ES6 module syntax
import LocalizedStrings from 'react-localization';

export const strings = new LocalizedStrings({
  en: {
    // Text for the transcribe page which allows the user to input files and transcribe them
    transcribe: {
      title: 'Transcribe',
      submit_button: 'Submit',
      // Each of the following are the labels for the input fields separated by the type of input
      audio: {
        title: 'Audio',
        prompt: 'Select audio file or drag and drop it here',
        placeholder: 'Interview.mp3'
      },
      directory: {
        title: 'Output Directory',
        prompt: 'Select a directory to save the output',
        placeholder: 'Select a directory',
        not_functional: 'Not functional yet, will just save to desktop'
      },
      language: {
        title: 'Language',
        prompt: 'Language spoken in the audio, specify none to perform automatic language detection',
        placeholder: 'Select a language',
        non_english_warning: 'Note: Languages other than english may have an increased error rate'
      },
      // The following are the labels for the models that can be used for transcription, each has a title and a description of the model.
      // These descriptions are used in the tooltip and inform the user of the model's accuracy and speed. This is not final and will be updated as we get more information on the models.
      models: {
        title: 'AI Model',
        options: {
          tiny: {
            title: 'Tiny',
            description: 'This is the smallest model, it is the fastest but struggles with non english languages'
          },
          base: {
            title: 'Base',
            description:
              'This is the default model, it is a good balance of speed and accuracy for english transcription'
          },
          small: {
            title: 'Small',
            description:
              'This is a larger model that is suitable for non-english language transcription and translation'
          },
          medium: {
            title: 'Medium',
            description:
              'This is a large model that can be used with any language, if using english this will likely be the best model for most people'
          },
          large: {
            title: 'Large',
            description:
              'This is the largest model, it is the most accurate but also the slowest. It requires a lot of memory to run'
          }
        }
      }
    },
    // Text for the dashboard home page
    dashboard: {
      title: 'Dashboard',
      subtitle: 'View and manage your transcription jobs',
      no_jobs: 'No jobs found',
      job: {
        title: 'Job',
        subtitle: 'View and manage your transcription job',
        status: {
          title: 'Status',
          options: {
            pending: 'Pending',
            processing: 'Processing',
            complete: 'Complete',
            error: 'Error'
          }
        },
        progress: {
          title: 'Progress',
          subtitle: 'Progress of the job'
        },
        output: {
          title: 'Output',
          subtitle: 'Output of the job',
          download: 'Download'
        },
        error: {
          title: 'Error',
          subtitle: 'Error message from the job'
        },
        delete: 'Delete'
      }
    },
    // Text for the interview mode where a user can record audio and have it transcribed in real time
    interview: {
      title: 'Interview',
      subtitle: 'Record an interview and transcribe it',
      record: {
        title: 'Record',
        subtitle: 'Record an interview',
        start: 'Start',
        stop: 'Stop',
        pause: 'Pause',
        resume: 'Resume',
        recording: 'Recording...',
        paused: 'Paused',
        stopped: 'Stopped'
      }
    },
    // Text for the settings page
    settings: {
      title: 'Settings',
      subtitle: 'Manage your account settings',
      toggle_dark_mode: 'Toggle Dark Mode',
      language: {
        title: 'Language',
        subtitle: 'Change the language of the application',
        prompt: 'Select a language',
        placeholder: 'Select a language'
      }
    },
    // Text for the about page
    about: {
      title: 'About',
      subtitle: 'Learn more about Stage Whisper',
      github: 'GitHub',
      discord: 'Discord',
      twitter: 'Twitter',
      email: 'Email',
      privacy_policy: 'Privacy Policy',
      terms_of_service: 'Terms of Service'
    },
    // Text for the sidebar which shows recent transcriptions
    sidebar: {
      title: 'Recent Transcriptions'
    }
  },
  // Turkish translation -- Ai
  tr: {
    transcribe: {
      title: 'Transkribe',
      submit_button: 'Gönder',
      audio: {
        title: 'Ses',
        prompt: 'Ses dosyasını seçin veya buraya sürükleyip bırakın',
        placeholder: 'Röportaj.mp3'
      },
      directory: {
        title: 'Çıktı Dizini',
        prompt: 'Çıktıyı kaydetmek için bir dizin seçin',
        placeholder: 'Bir dizin seçin',
        not_functional: 'Henüz çalışmıyor, masaüstüne kaydedilecek'
      },
      language: {
        title: 'Dil',
        prompt: 'Seste konuşulan dili belirtin, otomatik dil algılama yapmak için hiçbiri seçin',
        placeholder: 'Bir dil seçin',
        non_english_warning: 'Not: İngilizce dışı diğer dillerde hata oranı artabilir'
      },
      models: {
        title: 'AI Modeli',
        options: {
          tiny: {
            title: 'Tiny',
            description: 'Bu en küçük modeldir, en hızlıdır ancak İngilizce dışı dillerde sorun yaşar'
          },
          base: {
            title: 'Base',
            description:
              'Bu varsayılan modeldir, İngilizce transkripsiyonu için hız ve doğruluk açısından iyi bir denge sağlar'
          },
          small: {
            title: 'Small',
            description: 'Bu daha büyük bir modeldir, İngilizce dışı dil transkripsiyonu ve çevirisinde kullanılabilir'
          },
          medium: {
            title: 'Medium',
            description:
              'Bu büyük bir modeldir, herhangi bir dil için kullanılabilir, İngilizce kullanıyorsanız muhtemelen çoğu insan için en iyi modeldir'
          },
          large: {
            title: 'Large',
            description:
              'Bu en büyük modeldir, en doğru ancak en yavaştır. Çalıştırmak için çok fazla bellek gerektirir'
          }
        }
      }
    },
    dashboard: {
      title: 'Kontrol Paneli',
      subtitle: 'Transkripsiyon işlerinizi görüntüleyin ve yönetin',
      no_jobs: 'İş bulunamadı',
      job: {
        title: 'İş',
        subtitle: 'Transkripsiyon işinizi görüntüleyin ve yönetin',
        status: {
          title: 'Durum',
          options: {
            pending: 'Bekliyor',
            processing: 'İşleniyor',
            complete: 'Tamamlandı',
            error: 'Hata'
          }
        },
        progress: {
          title: 'İlerleme',
          subtitle: 'İşin ilerlemesi'
        },
        output: {
          title: 'Çıktı',
          subtitle: 'İşin çıktısı',
          download: 'İndir'
        },
        error: {
          title: 'Hata',
          subtitle: 'İşten gelen hata mesajı'
        },
        delete: 'Sil'
      }
    },
    interview: {
      title: 'Röportaj',
      subtitle: 'Röportaj kaydedin ve transkribe edin',
      record: {
        title: 'Kayıt',
        subtitle: 'Röportaj kaydedin',
        start: 'Başlat',
        stop: 'Durdur',
        pause: 'Duraklat',
        resume: 'Devam et',
        recording: 'Kaydediliyor...',
        paused: 'Duraklatıldı',
        stopped: 'Durduruldu'
      }
    },
    settings: {
      title: 'Ayarlar',
      subtitle: 'Hesap ayarlarınızı yönetin',
      toggle_dark_mode: 'Karanlık Modu Aç/Kapa',
      language: {
        title: 'Dil',
        subtitle: 'Uygulamanın dili değiştirin',
        prompt: 'Bir dil seçin',
        placeholder: 'Bir dil seçin'
      }
    },
    about: {
      title: 'Hakkında',
      subtitle: 'Stage Whisper hakkında daha fazla bilgi edinin',
      github: 'GitHub',
      discord: 'Discord',
      twitter: 'Twitter',
      email: 'Email',
      privacy_policy: 'Gizlilik Politikası',
      terms_of_service: 'Hizmet Şartları'
    },
    sidebar: {
      title: 'Son Transkripsiyonlar'
    }
  }
});
export default strings;
