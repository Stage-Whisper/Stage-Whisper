// ES6 module syntax
import LocalizedStrings from 'react-localization';

export const strings = new LocalizedStrings(
  {
    en: {
      util: {
        app_name: 'StageWhisper',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        cancel: 'Cancel',
        close: 'Close',
        save: 'Save',
        saving: 'Saving...',
        loading: 'Loading...',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        success: 'Success',
        unknown: 'Unknown',
        unknownError: 'Unknown error',
        unknownWarning: 'Unknown warning',
        unknownInfo: 'Unknown info',
        on: 'On',
        off: 'Off',
        enabled: 'Enabled',
        disabled: 'Disabled'
      },

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
          placeholder: 'Select an output directory',
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
      transcriptions: {
        title: 'Transcriptions',
        // The following are the labels for the table that displays the transcriptions
        table: {
          title: 'Transcriptions',
          columns: {
            name: 'Name',
            date: 'Date',
            duration: 'Duration',
            language: 'Language',
            model: 'Model',
            status: 'Status',
            actions: 'Actions'
          },
          status: {
            pending: 'Pending',
            processing: 'Processing',
            complete: 'Complete',
            error: 'Error'
          },
          actions: {
            edit: 'Edit',
            play: 'Play',
            open: 'Open',
            delete: 'Delete'
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
          subtitle:
            'This is the language that the application will be displayed in, it will not affect the language of the transcriptions',
          prompt: 'Select a language for the application',
          placeholder: 'Select a language'
        },
        large_model_support: {
          title: 'Large Model Support',
          subtitle:
            'This will enable the use of the large models, this will require a significant amount of memory and is not suitable for most users'
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
        terms_of_service: {
          title: 'Terms of Service',
          subtitle: 'Terms of Service for Stage Whisper',
          paragraph1: 'By using Stage Whisper you agree to the following terms of service: XYZ'
        }
      },
      // Text for the sidebar which shows recent transcriptions
      sidebar: {
        title: 'Recent Transcriptions'
      },
      languages: {
        en: 'English',
        zh: 'Chinese',
        de: 'German',
        es: 'Spanish',
        ru: 'Russian',
        ko: 'Korean',
        fr: 'French',
        ja: 'Japanese',
        pt: 'Portuguese',
        tr: 'Turkish',
        pl: 'Polish',
        ca: 'Catalan',
        nl: 'Dutch',
        ar: 'Arabic',
        sv: 'Swedish',
        it: 'Italian',
        id: 'Indonesian',
        hi: 'Hindi',
        fi: 'Finnish',
        vi: 'Vietnamese',
        iw: 'Hebrew',
        uk: 'Ukrainian',
        el: 'Greek',
        ms: 'Malay',
        cs: 'Czech',
        ro: 'Romanian',
        da: 'Danish',
        hu: 'Hungarian',
        ta: 'Tamil',
        no: 'Norwegian',
        th: 'Thai',
        ur: 'Urdu',
        hr: 'Croatian',
        bg: 'Bulgarian',
        lt: 'Lithuanian',
        la: 'Latin',
        mi: 'Maori',
        ml: 'Malayalam',
        cy: 'Welsh',
        sk: 'Slovak',
        te: 'Telugu',
        fa: 'Persian',
        lv: 'Latvian',
        bn: 'Bengali',
        sr: 'Serbian',
        az: 'Azerbaijani',
        sl: 'Slovenian',
        kn: 'Kannada',
        et: 'Estonian',
        mk: 'Macedonian',
        br: 'Breton',
        eu: 'Basque',
        is: 'Icelandic',
        hy: 'Armenian',
        ne: 'Nepali',
        mn: 'Mongolian',
        bs: 'Bosnian',
        kk: 'Kazakh',
        sq: 'Albanian',
        sw: 'Swahili',
        gl: 'Galician',
        mr: 'Marathi',
        pa: 'Punjabi',
        si: 'Sinhala',
        km: 'Khmer',
        sn: 'Shona',
        yo: 'Yoruba',
        so: 'Somali',
        af: 'Afrikaans',
        oc: 'Occitan',
        ka: 'Georgian',
        be: 'Belarusian',
        tg: 'Tajik',
        sd: 'Sindhi',
        gu: 'Gujarati',
        am: 'Amharic',
        yi: 'Yiddish',
        lo: 'Lao',
        uz: 'Uzbek',
        fo: 'Faroese',
        ht: 'Haitian creole',
        ps: 'Pashto',
        tk: 'Turkmen',
        nn: 'Nynorsk',
        mt: 'Maltese',
        sa: 'Sanskrit',
        lb: 'Luxembourgish',
        my: 'Myanmar',
        bo: 'Tibetan',
        tl: 'Tagalog',
        mg: 'Malagasy',
        as: 'Assamese',
        tt: 'Tatar',
        haw: 'Hawaiian',
        ln: 'Lingala',
        ha: 'Hausa',
        ba: 'Bashkir',
        jw: 'Javanese',
        su: 'Sundanese',
        my2: 'Burmese',
        ca2: 'Valencian',
        nl2: 'Flemish',
        ht2: 'Haitian',
        lb2: 'Letzeburgesch',
        ps2: 'Pushto',
        pa2: 'Panjabi',
        si2: 'Sinhalese',
        es2: 'Castilian',
        ro2: 'Moldavian',
        ro3: 'Moldovan'
      }
    },
    // Turkish translation -- Ai
    // FIXME: This is a placeholder translation
    tr: {
      util: {
        app_name: 'Turkish - Stage Whisper - Needs Translation'
      },
      transcribe: {
        title: 'Deşifre',
        submit_button: 'Gönder',
        audio: {
          title: 'Ses',
          prompt: 'Ses dosyasını seçin veya buraya sürükleyip bırakın',
          placeholder: 'Röportaj.mp3'
        },
        directory: {
          title: 'Çıktı Klasörü',
          prompt: 'Çıktıyı kaydetmek için bir klasör seçin',
          placeholder: 'Bir klasör seçin',
          not_functional: 'Henüz çalışmıyor, masaüstüne kaydedilecek'
        },
        language: {
          title: 'Dil',
          prompt: 'Kayıtta konuşulan dili belirtin, dilin otomatik algılanması için boş bırakın',
          placeholder: 'Bir dil seçin',
          non_english_warning: 'Not: İngilizce dışındaki dillerde doğruluk payı daha düşük olabilir'
        },
        models: {
          title: 'AI Modeli',
          options: {
            tiny: {
              title: 'Tiny',
              description: 'En küçük en hızlı çalışan model. İngilizce dışındaki dillerde zorlanabilir.'
            },
            base: {
              title: 'Base',
              description:
                'Öntanımlı gelen model. İngilizce deşifresi için hız ve doğruluk açısından iyi bir denge sağlar.'
            },
            small: {
              title: 'Small',
              description: 'Daha büyük bir model. İngilizce dışı dil deşifresinde ve çevirisinde kullanıma uygundur.'
            },
            medium: {
              title: 'Medium',
              description:
                'Büyük bir model. Herhangi bir dil için kullanılabilir. İngilizce kullanılacaksa çoğu insan için en iyi sonucu verecektir.'
            },
            large: {
              title: 'Large',
              description:
                'En büyük model. Doğruluk payı diğerlerinden daha yüksek ancak çalışma hızı diğerlerinden yavaştır. Çalıştırmak için çok yüksek bellek gerektirir.'
            }
          }
        }
      },
      dashboard: {
        title: 'Kontrol Paneli',
        subtitle: 'Deşifre işlemlerinizi görüntüleyin ve yönetin',
        no_jobs: 'İşlem bulunmamaktadır',
        job: {
          title: 'İşlem',
          subtitle: 'Deşifre işleminizi görüntüleyin ve yönetin',
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
            title: 'İlerleyiş',
            subtitle: 'İşlem ilerleyişi'
          },
          output: {
            title: 'Çıktı',
            subtitle: 'İşlemin çıktısı',
            download: 'İndir'
          },
          error: {
            title: 'Hata',
            subtitle: 'İşlemden gelen hata mesajı'
          },
          delete: 'Sil'
        }
      },
      interview: {
        title: 'Röportaj',
        subtitle: 'Röportaj kaydedin ve deşifre edin',
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
          subtitle: 'Uygulamanın dilini değiştirin',
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
        title: 'Son Deşifreler'
      },
      languages: {
        en: 'İngilizce',
        tr: 'Türkçe',
        fr: 'Fransızca'
      }
    },
    // French translation -- Ai
    fr: {
      util: {
        app_name: 'French - Stage Whisper - Needs Translation'
      },
      languages: {
        fr: 'Français',
        en: 'Anglais'
      }
    },
    // German translation -- Ai
    de: {
      util: {
        app_name: 'German - Stage Whisper - Needs Translation'
      },
      languages: {
        de: 'Deutsch',
        en: 'Englisch'
      }
    },
    // Spanish translation -- Ai
    es: {
      util: {
        app_name: 'Spanish - Stage Whisper - Needs Translation'
      },
      languages: {
        es: 'Español',
        en: 'Inglés'
      }
    }
  },
  {
    logsEnabled: false, // Enable or disable logs
    pseudo: false // Set to true to insert garbage characters into the strings to test localization
  }
);
export default strings;
