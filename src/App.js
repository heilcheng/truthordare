import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardContent, ThemeProvider, createTheme, Switch, FormControlLabel, Box, TextField, Chip } from '@mui/material';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#ff6b9d' : '#e91e63',
    },
    secondary: {
      main: mode === 'dark' ? '#7c4dff' : '#651fff',
    },
    background: {
      default: mode === 'dark' ? '#0a0a0f' : '#faf5ff',
      paper: mode === 'dark' ? 'rgba(20, 20, 35, 0.85)' : 'rgba(255, 255, 255, 0.9)',
    },
  },
  typography: {
    fontFamily: '"Noto Sans HK", "Helvetica Neue", Arial, sans-serif',
  },
});

// All questions - combined from original + PR contributions
const allQuestions = [
  // Original Truth Questions
  "如果你係一種食物，你會係咩？點解？",
  "你最奇怪嘅夢係咩？",
  "如果你可以變成任何卡通人物，你會揀邊個？",
  "如果你嘅寵物識講嘢，你覺得佢會話咩俾你聽？",
  "你剪過最核突嘅髮型係點樣？有相睇吓嗎？",
  "如果你係一個超級英雄，你嘅超能力會係咩？你嘅弱點呢？",
  "你最鍾意嘅怪異食物配搭係咩？",
  "如果你一世只可以著一隻顏色嘅衫，你會揀咩色？",
  "你最後悔嘅飲醉酒經歷係咩？",
  "如果你可以同任何名人約會，你會揀邊個？點解？",
  "你最唔掂嘅約會經歷係咩？",
  "如果你可以改自己嘅名，你會改成咩名？",
  "你曾經喺公共場合做過最尷尬嘅事係咩？",
  "如果你可以變成任何動物，你會揀變成咩？點解？",
  "你最奇怪嘅習慣係咩？",
  "如果你一世只可以食一樣嘢，你會揀咩？",
  "如果你可以同歷史上嘅任何人食飯，你會揀邊個？你會問佢咩問題？",
  "你講過最離譜嘅大話係咩？",
  "如果你可以即時學識一種技能，你會揀咩？",
  "你做過最幼稚嘅事係咩？",
  "如果你可以變成任何電影角色，你會揀邊個？",
  "你出街最唔掂嘅打扮係點？",
  "如果你可以同任何虛構人物做朋友，你會揀邊個？",
  "如果你唔使瞓覺，你會用嗰啲多出嚟嘅時間做咩？",
  "你收集過最奇怪嘅嘢係咩？",
  "如果你可以成為任何名人嘅助理一天，你會揀邊個？點解？",
  "你煮過最失敗嘅食物係咩？",
  "如果你可以同任何動物交換一日，你會揀咩動物？",
  "你最奇怪嘅幸運物係咩？",
  "如果你一世只可以聽一首歌，你會揀咩歌？",
  "你喺網購做過最尷尬嘅事係咩？",
  "如果你係一種調味料，你會係咩？點解？",
  "如果你一世只可以保持一個表情，你會揀咩表情？",
  "如果你可以同任何傢俬交換一日，你會揀咩？點解？",
  "你做過最失敗嘅DIY項目係咩？",
  "如果你可以變成一種交通工具，你會揀咩？點解？",
  "你出過最尷尬嘅Social Media Post係咩？",
  "如果你一世只可以用一個Emoji，你會揀邊個？",
  "你最奇怪嘅夢想工作係咩？",
  "如果你一世只可以睇一類型嘅電影，你會揀咩類型？",
  "你理髮最慘嘅經歷係咩？",
  "如果你可以變成一種水果，你會揀咩？點解？",
  "你寫過最尷尬嘅卡片內容係咩？",
  "如果你一世只可以玩一隻遊戲，你會揀咩？",
  "你最尷尬嘅戀愛經歷係咩？",
  "你會願意為錢做一啲羞恥嘅事嗎？如果會，係咩？",
  "你對一夜情有咩睇法？",
  "你曾經最尷尬嘅網上搜尋係咩？",
  "你覺得自己最「痴線」嘅性格係咩？",
  "你有冇試過鍾意你朋友嘅另一半？",
  "你有冇試過鍾意過一個唔應該鍾意嘅人？",
  "你曾經做過最唔負責任嘅事係咩？",
  "你覺得係咪有啲話題永遠唔應該同父母討論？",
  "你最怕另一半知你咩秘密？",
  "你試過拒絕一個你其實有興趣嘅人嗎？點解？",
  "你試過同幾個人同時有曖昧關係？",
  "你最荒唐嘅愛情經歷係咩？",
  "你覺得自己係咪一個醋王？",
  "你有冇試過喺社交平台上話自己單身，但其實有另一半？",
  "你覺得你最無法接受另一半做咩行為？",
  "你試過用邊種離譜嘅藉口甩底？",
  "你試過冇錢時做過最奇怪嘅事係咩？",
  "你有冇試過講一啲後悔講出口嘅說話？",
  "你覺得自己對異性係咪有過度幻想？",
  "你會唔會考慮同年紀大好多嘅人拍拖？",
  "你最尷尬嘅曖昧訊息係咩？",
  "你曾經最「狼死」嘅行為係咩？",
  "你最冇辦法原諒自己嘅一件事係咩？",
  "你有冇試過用朋友嘅秘密去威脅佢？",
  "你有無試過暗戀一個老師？",
  "你曾經最失禮嘅事係咩？",
  "你最瘋狂嘅夢想係咩？",
  "你有冇曾經覺得自己拍緊一段錯誤嘅拖？",
  "你最想同邊個朋友「絕交」但又唔敢？",
  "你有無試過偷偷鍾意自己嘅同學／同事？",
  "你最難忘嘅約會係點？",
  "你覺得喺戀愛入面最重要嘅係咩？",
  "你試過暗戀過一個完全唔識嘅陌生人？",
  "你有冇試過為咗戀愛而放棄朋友？",
  "你覺得自己係咪一個好容易會妒忌人地嘅人？",
  "你試過鍾意一個人幾耐先放手？",
  "你覺得有咩嘢係你應該話俾屋企人知但一直唔敢講？",
  "你有冇試過大庭廣眾之下認錯人？最尷尬嘅一次係點？",
  "你覺得自己嘅初戀/暗戀係幸福定係災難？",
  "你覺得自己最搞笑嘅一個癖好係咩？",
  "你有冇試過同一個人拖拖拉拉好多次？",
  "你有無好心做錯事嘅經歷？",
  "你有冇試過話人哋係你朋友但其實心入面唔係咁認為？",
  "你有冇試過瞞住大家做咗一件自己覺得好有趣嘅事？",
  "你試過講過最假嘅藉口係咩？",
  "你覺得自己最想改變嘅一個缺點係咩？",
  // New questions from PR
  "分享一件你童年時，令你唔開心左好耐嘅事。",
  "分享一次網購中伏故事",
  "分享一次好老師故事。要有創意或者洋蔥！",
  "分享一次好癲嘅慶祝故事。要有創意或者洋蔥！",
  "分享一次考試作弊嘅經驗。要有創意！",
  "分享一次住醫/睇病經驗。要有創意或者洋蔥！",
  "分享一次放閃或者被放閃嘅經驗。要有創意！",
  "分享一次被冤枉嘅經驗。自己或者朋友都得！",
  "分享一次講大話被踢爆嘅經驗。要有創意！",
  "有冇試過一段時間好抑鬱？點解",
  "有冇試過故意唔接朋友電話？點解？",
  "有冇試過被屋企人打？點解？",
  "有冇試過被欺凌？係幾時？",
  "你大學/大專生涯做過最幼稚嘅事係咩？",
  "你中學生涯做過最幼稚嘅事係咩？",
  "你中學生涯做過最後悔嘅事係咩？",
  "你中學生涯最proud of自己咩？",
  "你好有咩小眾嘅興趣愛好？分享一下！",
  "你有無其他花名？同大家分享一下！",
  "你有無後悔揀錯major/科目，如果有你會揀咩？",
  "你考試最低分係？",
  "你信唔信MBTI？點解？",
  "你信唔信星座？點解？",
  "你信唔信緣分？點解？",
  "你信唔信運氣？點解？",
  "你最冇辦法原諒屋企人嘅一件事係咩？",
  "你覺得有咩嘢係屋企人虧欠你嘅？",
  "填充題：如果我crush第一次約會想帶我去____我會即刻block左佢",
  "填充題：如果我DSE30分，我依家應該____",
  "你覺得男朋友唔浪漫算唔算一種罪？",
  "分享三個無血緣關係，而確實係最重要嘅「緊急聯絡人」。",
  "「時光倒流一句話」，你會想同十年前自己講咩？",
  "分享一下你「最佳損友」係邊個，試問依位損友做過d咩？",
  // Dare Questions
  "你最尷尬嘅舞步係咩？依家示範比大家睇！",
  "你唱過最難聽嘅卡拉OK係咩歌？而家唱一段！",
  "你最鍾意嘅尷尬笑話係咩？而家講俾大家聽！",
  "你自拍過最核突嘅相係點樣？比大家睇吓！",
  "你有咩奇怪嘅天賦？而家示範俾大家睇！",
  "你試過喺公眾地方做過最瘋狂嘅事係咩？",
  "你最癲嘅生日慶祝係點？",
  "即刻影張奇怪Selfie post IG Story",
  "用廣東話唱一段你最鍾意嘅歌",
  "模仿一個朋友嘅動作或者講嘢方式",
  "即刻打電話俾一個朋友，同佢講你愛佢",
  "做10下掌上壓",
  "用普通話講一個笑話",
  "扮狗叫三聲",
  "跳一段舞",
  "用左手寫自己個名",
  "閉眼轉三個圈",
  "學雞叫",
  "做一個瑜伽動作",
  "用腳趾撿起一樣嘢",
  // Song-inspired questions from PR
  "你歌單裡面有無邊首歌係你開心個陣一定會聽？唱出黎！",
  "你歌單裡面有無邊首歌係你down個陣一定會聽？唱出黎！",
  "你歌單裡面最近/上一次聽緊邊首歌？唱出黎！",
  "你歌單裡面近期最常聽邊首歌？唱出黎！",
  "你歌單裡面最鐘意邊首歌？唱出黎！",
  "宜家係「懷舊金曲之夜」，你最中意邊首陳年舊曲？唱出黎！",
  "分享最上一個「無題時想起的人」，點解會想起？",
  "你覺得自己仲會有幾多個「下一位前度」？",
  "你覺得「老派約會」尚有無必要？",
  "講一個「未開始已經結束」嘅故事？",
  "你「夢中的婚禮」係咩樣?",
  "你有無一刻覺得自己係「錯誤的宇宙尋找愛」。",
];

const TruthOrDareGenerator = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeMode, setThemeMode] = useState('dark');
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    try {
      setLoading(true);
      const savedQuestions = localStorage.getItem('truth-or-dare-questions-v2');
      
      if (savedQuestions) {
        const parsedQuestions = JSON.parse(savedQuestions);
        setQuestions(parsedQuestions);
      } else {
        setQuestions(allQuestions);
        localStorage.setItem('truth-or-dare-questions-v2', JSON.stringify(allQuestions));
      }
      setError(null);
    } catch (err) {
      console.error('Error loading questions:', err);
      setQuestions(allQuestions);
      setError('載入問題時出錯');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestion = useCallback(() => {
    if (questions.length === 0) {
      setCurrentQuestion("冇問題可以生成，請先添加問題！");
      return;
    }
    
    setIsSpinning(true);
    
    let count = 0;
    const maxCount = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  }, [questions]);

  const addNewQuestion = () => {
    if (newQuestion.trim() !== "") {
      try {
        const updatedQuestions = [...questions, newQuestion.trim()];
        setQuestions(updatedQuestions);
        localStorage.setItem('truth-or-dare-questions-v2', JSON.stringify(updatedQuestions));
        setNewQuestion("");
        setError(null);
      } catch (err) {
        console.error('Error adding question:', err);
        setError('添加問題失敗');
      }
    }
  };

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = getTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          background: themeMode === 'dark' 
            ? 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 25%, #f0abfc 50%, #e9d5ff 75%, #faf5ff 100%)',
          transition: 'background 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 4 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: themeMode === 'dark'
              ? 'radial-gradient(circle at 20% 80%, rgba(255, 107, 157, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124, 77, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(0, 188, 212, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 80%, rgba(233, 30, 99, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              borderRadius: '50%',
              background: themeMode === 'dark' 
                ? `rgba(${Math.random() > 0.5 ? '255, 107, 157' : '124, 77, 255'}, ${Math.random() * 0.3 + 0.1})`
                : `rgba(${Math.random() > 0.5 ? '233, 30, 99' : '156, 39, 176'}, ${Math.random() * 0.2 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              pointerEvents: 'none',
            }}
          />
        ))}
        
        <Card 
          sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', sm: 500, md: 550 },
            backgroundColor: 'background.paper',
            borderRadius: 4,
            boxShadow: themeMode === 'dark'
              ? '0 25px 80px -12px rgba(255, 107, 157, 0.25), 0 15px 40px -10px rgba(124, 77, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              : '0 25px 80px -12px rgba(233, 30, 99, 0.2), 0 15px 40px -10px rgba(156, 39, 176, 0.15)',
            border: '1px solid',
            borderColor: themeMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(233, 30, 99, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: themeMode === 'dark'
                ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.5), rgba(124, 77, 255, 0.5), rgba(0, 188, 212, 0.5))'
                : 'linear-gradient(135deg, rgba(233, 30, 99, 0.4), rgba(156, 39, 176, 0.4))',
              borderRadius: 5,
              zIndex: -1,
              opacity: 0.5,
              filter: 'blur(20px)',
            }
          }}
        >
          <CardContent sx={{ padding: { xs: 3, sm: 5 }, '&:last-child': { pb: { xs: 3, sm: 5 } } }}>
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Box sx={{ 
                    fontSize: '2.5rem',
                    animation: 'bounce 2s ease-in-out infinite',
                  }}>
                    🎲
                  </Box>
                  <Box 
                    component="h1" 
                    sx={{ 
                      margin: 0,
                      fontSize: { xs: '1.8rem', sm: '2.2rem' },
                      fontWeight: 800,
                      background: themeMode === 'dark'
                        ? 'linear-gradient(135deg, #fff 0%, #ff6b9d 50%, #7c4dff 100%)'
                        : 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    真心話大冒險
                  </Box>
                </Box>
                <Box 
                  component="p" 
                  sx={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: themeMode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                    fontWeight: 500,
                    pl: 0.5,
                  }}
                >
                  廣東話版 • 問題生成器
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch 
                    checked={themeMode === 'dark'} 
                    onChange={handleThemeToggle} 
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ff6b9d',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#ff6b9d',
                      }
                    }}
                  />
                }
                label={themeMode === 'dark' ? '🌙' : '☀️'}
                labelPlacement="start"
                sx={{ 
                  margin: 0,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '1.2rem',
                  }
                }}
              />
            </Box>
            
            {/* Loading State */}
            {loading && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⏳</Box>
              </Box>
            )}
            
            {/* Error State */}
            {error && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 2,
                mb: 2,
                background: 'rgba(255, 82, 82, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(255, 82, 82, 0.3)'
              }}>
                <Box component="p" sx={{ color: '#ff5252', m: 0, fontWeight: 500 }}>
                  ⚠️ {error}
                </Box>
              </Box>
            )}
            
            {/* Generate Button */}
            <Button 
              variant="contained" 
              onClick={generateQuestion}
              fullWidth
              disabled={loading || isSpinning}
              sx={{ 
                mb: 3,
                py: 2,
                fontSize: '1.25rem',
                fontWeight: 700,
                background: themeMode === 'dark'
                  ? 'linear-gradient(135deg, #ff6b9d 0%, #7c4dff 50%, #00bcd4 100%)'
                  : 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
                backgroundSize: '200% 200%',
                animation: isSpinning ? 'gradient 0.5s ease infinite' : 'gradient 5s ease infinite',
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(255, 107, 157, 0.4)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 2s infinite',
                },
                '&:hover': { 
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(255, 107, 157, 0.5)',
                },
                '&:disabled': {
                  background: themeMode === 'dark'
                    ? 'linear-gradient(135deg, #ff6b9d 0%, #7c4dff 50%, #00bcd4 100%)'
                    : 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
                  opacity: 0.8,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {isSpinning ? '🎰 抽緊...' : '🎲 生成問題'}
            </Button>
            
            {/* Question Display */}
            {currentQuestion && (
              <Box 
                sx={{ 
                  mb: 4, 
                  p: 3,
                  background: themeMode === 'dark'
                    ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(124, 77, 255, 0.1))'
                    : 'linear-gradient(135deg, rgba(233, 30, 99, 0.08), rgba(156, 39, 176, 0.08))',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: themeMode === 'dark' 
                    ? 'rgba(255, 107, 157, 0.2)' 
                    : 'rgba(233, 30, 99, 0.2)',
                  animation: isSpinning ? 'pulse 0.15s ease-in-out infinite' : 'slideIn 0.5s ease-out',
                }}
              >
                <Box 
                  component="p" 
                  sx={{ 
                    m: 0,
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    lineHeight: 1.7,
                    color: themeMode === 'dark' ? '#fff' : '#1a1a1a',
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  💭 {currentQuestion}
                </Box>
              </Box>
            )}
            
            {/* Add Question Section */}
            <Box sx={{ 
              background: themeMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              borderRadius: 3,
              p: 3,
              border: '1px solid',
              borderColor: themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            }}>
              <Box 
                component="h3"
                sx={{
                  m: 0,
                  mb: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: themeMode === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  textAlign: 'center',
                }}
              >
                ✨ 添加自己嘅問題
              </Box>
              
              <TextField
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="輸入你嘅問題..."
                fullWidth
                variant="outlined"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && addNewQuestion()}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    '& fieldset': {
                      borderColor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: themeMode === 'dark' ? 'rgba(255, 107, 157, 0.5)' : 'rgba(233, 30, 99, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff6b9d',
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: themeMode === 'dark' ? '#fff' : '#1a1a1a',
                    '&::placeholder': {
                      color: themeMode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                      opacity: 1,
                    }
                  }
                }}
              />
              
              <Button 
                variant="outlined" 
                onClick={addNewQuestion}
                disabled={loading || newQuestion.trim() === ""}
                fullWidth
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: themeMode === 'dark' ? 'rgba(255, 107, 157, 0.5)' : 'rgba(233, 30, 99, 0.5)',
                  color: themeMode === 'dark' ? '#ff6b9d' : '#e91e63',
                  '&:hover': { 
                    borderColor: '#ff6b9d',
                    background: 'rgba(255, 107, 157, 0.1)',
                  },
                  '&:disabled': {
                    opacity: 0.4,
                  },
                }}
              >
                ➕ 添加問題
              </Button>
            </Box>
            
            {/* Footer */}
            <Box sx={{ 
              textAlign: 'center', 
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: themeMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
            }}>
              <Box 
                component="p" 
                sx={{ 
                  color: themeMode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', 
                  fontSize: '0.85rem', 
                  m: 0,
                  fontWeight: 500
                }}
              >
                📊 總問題數: {questions.length} • 本地儲存 💾
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+HK:wght@400;500;600;700;800&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 107, 157, 0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 107, 157, 0.5); }
      `}</style>
    </ThemeProvider>
  );
};

export default TruthOrDareGenerator;
