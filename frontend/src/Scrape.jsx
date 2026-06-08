import React, { useState , useEffect} from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import './Scrape.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import logo from './download.png';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Scrape = () => {
    const [username1, setUsername1] = useState("");
    const [username2, setUsername2] = useState("");
    const [fetchedUsername1, setFetchedUsername1] = useState("");
    const [fetchedUsername2, setFetchedUsername2] = useState("");
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [spinner, setSpinner] = useState(false);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const chartColors = {
        easy: '#10B981',     
        medium: '#F59E0B',    
        hard: '#EF4444',      
        skills: ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#84CC16']
    };

    const localDemoData = {
        user1: {
            TotalAttempted: 847,
            ActiveDays: 156,
            ProfileRank: 1250,
            NumberOfBadges: 12,
            Badges: [
                "https://leetcode.com/static/images/badges/2023/2023-12-01.png",
                "https://leetcode.com/static/images/badges/2023/2023-11-01.png",
                "https://leetcode.com/static/images/badges/2023/2023-10-01.png",
                "https://leetcode.com/static/images/badges/2023/2023-09-01.png"
            ],
            SectionAttempted: [342, 0, 398, 5, 107],
            Skills: ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Tree"],
            elements: [156, 134, 98, 6, 76, 65],
            RecentlySolveds: [
                "Two Sum",
                "Valid Parentheses",
                "Merge Two Sorted Lists",
                "Maximum Subarray",
                "Climbing Stairs",
                "Best Time to Buy and Sell Stock"
            ]
        },
        user2: {
            TotalAttempted: 623,
            ActiveDays: 198,
            ProfileRank: 2150,
            NumberOfBadges: 8,
            Badges: [
                "https://leetcode.com/static/images/badges/2023/2023-11-01.png",
                "https://leetcode.com/static/images/badges/2023/2023-10-01.png",
                "https://leetcode.com/static/images/badges/2023/2023-09-01.png",
                "https://leetcode.com/static/images/badges/2023/2023-08-01.png"
            ],
            SectionAttempted: [245, 80, 298, 0, 180],
            Skills: ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Tree"],
            elements: [112, 98, 76, 65, 54, 43],
            RecentlySolveds: [
                "Valid Parentheses",
                "Two Sum",
                "Palindrome Number",
                "Roman to Integer",
                "Longest Common Prefix",
                "Remove Duplicates from Sorted Array"
            ]
        }
    };

    function changeUsername1(e) {
        setUsername1(e.target.value);
    }

    function changeUsername2(e) {
        setUsername2(e.target.value);
    }

    async function FetchData(e) {
        setSpinner(true);
        try {
            if (username1.length === 0 || username1 === null) {
                toast.warn("Enter first username");
                e.preventDefault();
                return;
            }
            if (username2.length === 0 || username2 === null) {
                toast.warn("Enter second username");
                e.preventDefault();
                return;
            }

            const [response1, response2] = await Promise.all([
                axios.get(`http://localhost:5000/scrape/${username1}`),
                axios.get(`http://localhost:5000/scrape/${username2}`)
            ]);

            setData1(response1.data);
            setData2(response2.data);
            setFetchedUsername1(username1);
            setFetchedUsername2(username2);
            setComparisonMode(true);
            toast.success("Profiles fetched successfully!");
            setUsername1("");
            setUsername2("");
        }
        catch (e) {
            console.log("Backend error, using local demo data as fallback");
            // Use local demo data as fallback
            setData1(localDemoData.user1);
            setData2(localDemoData.user2);
            setFetchedUsername1(username1);
            setFetchedUsername2(username2);
            setComparisonMode(true);
            toast.info("Backend unavailable. Using demo data for demonstration.");
            setUsername1("");
            setUsername2("");
        }
        finally {
            setSpinner(false);
        }
    }

    const EnterEvent = (e) => {
        if (e.key === "Enter") {
            FetchData();
        }
    }

    const resetComparison = () => {
        setData1(null);
        setData2(null);
        setFetchedUsername1("");
        setFetchedUsername2("");
        setComparisonMode(false);
        setUsername1("");
        setUsername2("");
        setShowResetModal(false);
    }

    const openResetModal = () => {
        setShowResetModal(true);
    }

    const closeResetModal = () => {
        setShowResetModal(false);
    }


    function RenderEmptyState() {
        return (
            <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>Ready to Compare LeetCode Profiles?</h3>
                <p>Enter two usernames above to start comparing their coding achievements, skills, and progress.</p>
               
                <div className="demo-info">
                    💡 <strong>Demo Mode:</strong> Click "🎭 Try Demo Data" to see the app in action with sample profiles!
                </div>
                
                <div className="empty-features">
                    <div className="feature-item">
                        <span className="feature-icon">🏆</span>
                        <span>Performance Comparison</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📈</span>
                        <span>Skills Analysis</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <span>Progress Tracking</span>
            </div>
                </div>
            </div>
        );
    };

    const renderComparisonCard = (data, username, isFirst) => {
        if (!data) return null;
        
        const isWinner = (metric, value1, value2) => {
            if (metric === 'rank') {
                return value1 < value2; // Lower rank is better
            }
            return value1 > value2; // Higher value is better
        };

        const totalWinner = isWinner('total', data.TotalAttempted, isFirst ? data2?.TotalAttempted : data1?.TotalAttempted);
        const activeDaysWinner = isWinner('active', data.ActiveDays, isFirst ? data2?.ActiveDays : data1?.ActiveDays);
        const rankWinner = isWinner('rank', data.ProfileRank, isFirst ? data2?.ProfileRank : data1?.ProfileRank);
        
        return (
            <div className={`comparison-card ${isFirst ? 'user1-card' : 'user2-card'}`}>
                <div className="card-header">
                    <h3 className='comparison-username'>{username}</h3>
                    <div className="user-badge">
                        {username}
                    </div>
                </div>
                
                    <div className='innerbox'>
                        <div className='subinner-box'>
                        <div className={`card ${totalWinner ? 'winner-card' : ''}`}>
                                <div className="content">
                                    <p className="title">Total Questions</p>
                                    <p className="number">{data.TotalAttempted}</p>
                                {totalWinner && <div className="winner-badge">🏆 Winner</div>}
                            </div>
                        </div>
                        <div className={`card ${activeDaysWinner ? 'winner-card' : ''}`}>
                                <div className="content">
                                <p className="title">Active Days</p>
                                    <p className="number">{data.ActiveDays}</p>
                                {activeDaysWinner && <div className="winner-badge">🏆 Winner</div>}
                            </div>
                        </div>
                        <div className={`card ${rankWinner ? 'winner-card' : ''}`}>
                                <div className="content">
                                <p className="title">Profile Rank</p>
                                <p className="rank">#{data.ProfileRank}</p>
                                {rankWinner && <div className="winner-badge">🏆 Winner</div>}
                            </div>
                        </div>
                    </div>
                    
                        <div className='images-box'>
                        <p>Awards {data.NumberOfBadges}</p>
                            <p>Top Badges</p>
                            <div className='images-container'>
                                {data.Badges.map((badge, i) => (
                                <img className='badge-img' key={i} src={badge} alt={`badge-${i}`} />
                                ))}
                        </div>
                    </div>
                </div>
                
                    <div className='chart'>
                    <p className='sections'>Problems Solved by Difficulty</p>
                    {data.SectionAttempted ? (
                        <div className="chart-container">
                            <div className="difficulty-stats">
                                <div className="difficulty-item easy">
                                    <span className="difficulty-label">Easy</span>
                                    <span className="difficulty-count">{data.SectionAttempted[0]}</span>
                                    </div>
                                <div className="difficulty-item medium">
                                    <span className="difficulty-label">Medium</span>
                                    <span className="difficulty-count">{data.SectionAttempted[2]}</span>
                                    </div>
                                <div className="difficulty-item hard">
                                    <span className="difficulty-label">Hard</span>
                                    <span className="difficulty-count">{data.SectionAttempted[4]}</span>
                                </div>
                            </div>
                            <div className="doughnut-container">
                                <Doughnut 
                                    key={`doughnut-${username}`}
                                    data={{
                                    labels: ["Easy", "Medium", "Hard"],
                                        datasets: [{
                                            label: "Problems Solved",
                                            data: [data.SectionAttempted[0], data.SectionAttempted[2], data.SectionAttempted[4]],
                                            backgroundColor: [chartColors.easy, chartColors.medium, chartColors.hard],
                                            hoverBackgroundColor: [chartColors.easy, chartColors.medium, chartColors.hard],
                                            borderColor: [chartColors.easy, chartColors.medium, chartColors.hard],
                                            borderWidth: 3,
                                            borderRadius: 8,
                                        }]
                                    }} 
                                    options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    color: 'white',
                                                    font: { family: 'Poppins', size: 12, weight: '600' },
                                                    padding: 15,
                                                    usePointStyle: true
                                                }
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="chart-placeholder">
                            <div className="placeholder-text">Problems solved data will appear here</div>
                            <div className="placeholder-doughnut">
                                <div className="doughnut-sample"></div>
                                <div className="doughnut-center"></div>
                    </div>
                </div>
            )}
                </div>
                
                <div className='chart'>
                    <p className='sections'>Skills Proficiency</p>
                    {data.Skills && data.elements ? (
                        <div className="bar-chart-container">
                            <Bar
                                key={`skills-${username}`}
                            data={{
                                labels: data.Skills.map((skill, index) => skill),
                                    datasets: [{
                                        label: 'Skills Proficiency',
                                        data: data.elements,
                                        backgroundColor: chartColors.skills.map(color => `${color}CC`),
                                        borderColor: chartColors.skills,
                                        borderWidth: 2,
                                        borderRadius: 6,
                                        barThickness: 'flex',
                                        maxBarThickness: 50
                                    }]
                            }}
                            options={{
                                responsive: true,
                                    maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        ticks: {
                                            color: 'white',
                                                font: { family: 'Poppins', size: 11, weight: '500' }
                                        },
                                            grid: { display: false }
                                    },
                                    y: {
                                        ticks: {
                                            color: 'white',
                                                font: { family: 'Poppins', size: 11, weight: '500' }
                                            },
                                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                                        }
                                },
                                plugins: {
                                        legend: { display: false }
                                }
                            }}
                        />
                    </div>
                    ) : (
                        <div className="chart-placeholder">
                            <div className="placeholder-text">Skills data will appear here</div>
                            <div className="placeholder-chart">
                                <div className="bar-sample bar-1"></div>
                                <div className="bar-sample bar-2"></div>
                                <div className="bar-sample bar-3"></div>
                                <div className="bar-sample bar-4"></div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className='chart'>
                    <p className='sections'>Recently Solved Questions</p>
                    <div className='recent-questions'>
                        {data.RecentlySolveds && data.RecentlySolveds.length > 0 ? (
                            data.RecentlySolveds.slice(0, 6).map((item, index) => (
                                <div className='solved-ques' key={index}>
                                    <span className="question-number">#{index + 1}</span>
                                    <span className="question-title">{item}</span>
                                </div>
                            ))
                        ) : (
                            <div className="no-recent">
                                <span>No recently solved questions available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderComparisonSummary = () => {
        if (!data1 || !data2) return null;

        const getDifference = (val1, val2) => {
            const diff = val1 - val2;
            return {
                value: Math.abs(diff),
                isPositive: diff > 0,
                isEqual: diff === 0
            };
        };

        const totalDiff = getDifference(data1.TotalAttempted, data2.TotalAttempted);
        const activeDaysDiff = getDifference(data1.ActiveDays, data2.ActiveDays);
        const rankDiff = getDifference(data1.ProfileRank, data2.ProfileRank);

        return (
            <div className='comparison-summary'>
                <h2>🏆 Profile Comparison Summary</h2>
                <div className='summary-grid'>
                    <div className='summary-item'>
                        <h4>Total Questions</h4>
                        <div className='summary-values'>
                            <span className={`user1 ${totalDiff.isPositive && !totalDiff.isEqual ? 'winner' : ''}`}>
                                {data1.TotalAttempted}
                            </span>
                            <span className='vs'>vs</span>
                            <span className={`user2 ${!totalDiff.isPositive && !totalDiff.isEqual ? 'winner' : ''}`}>
                                {data2.TotalAttempted}
                            </span>
                        </div>
                        {!totalDiff.isEqual && (
                            <p className='difference'>
                                {totalDiff.isPositive ? fetchedUsername1 : fetchedUsername2} leads by {totalDiff.value} questions
                            </p>
                        )}
                    </div>
                    
                    <div className='summary-item'>
                        <h4>Active Days</h4>
                        <div className='summary-values'>
                            <span className={`user1 ${activeDaysDiff.isPositive && !activeDaysDiff.isEqual ? 'winner' : ''}`}>
                                {data1.ActiveDays}
                            </span>
                            <span className='vs'>vs</span>
                            <span className={`user2 ${!activeDaysDiff.isPositive && !activeDaysDiff.isEqual ? 'winner' : ''}`}>
                                {data2.ActiveDays}
                            </span>
                        </div>
                        {!activeDaysDiff.isEqual && (
                            <p className='difference'>
                                {activeDaysDiff.isPositive ? fetchedUsername1 : fetchedUsername2} has {activeDaysDiff.value} more active days
                            </p>
                        )}
                    </div>
                    
                    <div className='summary-item'>
                        <h4>Profile Rank</h4>
                        <div className='summary-values'>
                            <span className={`user1 ${!rankDiff.isPositive && !rankDiff.isEqual ? 'winner' : ''}`}>
                                #{data1.ProfileRank}
                            </span>
                            <span className='vs'>vs</span>
                            <span className={`user2 ${rankDiff.isPositive && !rankDiff.isEqual ? 'winner' : ''}`}>
                                #{data2.ProfileRank}
                            </span>
                        </div>
                        {!rankDiff.isEqual && (
                            <p className='difference'>
                                {!rankDiff.isPositive ? fetchedUsername1 : fetchedUsername2} has better rank
                            </p>
                        )}
                    </div>
                </div>
                
                <div className='skills-comparison'>
                    <h3>🎯 Skills Comparison</h3>
                    <div className='skills-grid'>
                        {data1.Skills.map((skill, index) => {
                            const skill1Value = data1.elements[index] || 0;
                            const skill2Value = data2.elements[data2.Skills.indexOf(skill)] || 0;
                            const skillDiff = getDifference(skill1Value, skill2Value);
                            
                            return (
                                <div key={index} className='skill-item'>
                                    <h4>{skill}</h4>
                                    <div className='skill-values'>
                                        <span className={`user1 ${skillDiff.isPositive && !skillDiff.isEqual ? 'winner' : ''}`}>
                                            {skill1Value}
                                        </span>
                                        <span className='vs'>vs</span>
                                        <span className={`user2 ${!skillDiff.isPositive && !skillDiff.isEqual ? 'winner' : ''}`}>
                                            {skill2Value}
                                        </span>
                                    </div>
                                    {!skillDiff.isEqual && (
                                        <p className='difference'>
                                            {skillDiff.isPositive ? fetchedUsername1 : fetchedUsername2} leads by {skillDiff.value}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='heading'>
                <span><img src={logo} alt='' /></span>
                <h1 className='titles'>LeetCode Profile Tracker</h1>
            </div>
            
            <div className='searchcontainer'>
                <div className='searchbox'>
                    <h2>Compare Two LeetCode Profiles</h2>  
                    <div className='username-inputs'>
                        <div className='username-input'>
                            <label>First Username:</label>
                            <input 
                                onChange={changeUsername1} 
                                onKeyDown={EnterEvent} 
                                value={username1} 
                                placeholder='Enter first username' 
                                autoFocus 
                            />
                        </div>
                        <div className='username-input'>
                            <label>Second Username:</label>
                            <input 
                                onChange={changeUsername2} 
                                onKeyDown={EnterEvent} 
                                value={username2} 
                                placeholder='Enter second username' 
                            />
                        </div>
                    </div>
                    <div>
                        <p>Examples : Your Name and rahulvarma5297 </p>
                    </div>
                </div>
                
                <div className="button-group">
                    <button className='fetch-button' onClick={FetchData}>
                        🔍 Compare Profiles
                    </button>
                    <button className='demo-button' onClick={() => {
                        setUsername1("DemoUser1");
                        setUsername2("DemoUser2");
                        setSpinner(true);
                        
                        // Try to fetch demo data from backend first
                        Promise.all([
                            axios.get('http://localhost:5000/scrape/DemoUser1'),
                            axios.get('http://localhost:5000/scrape/DemoUser2')
                        ]).then(([response1, response2]) => {
                            setData1(response1.data);
                            setData2(response2.data);
                            setFetchedUsername1("DemoUser1");
                            setFetchedUsername2("DemoUser2");
                            setComparisonMode(true);
                            toast.success("Demo profiles loaded successfully from backend!");
                            setUsername1("");
                            setUsername2("");
                        }).catch((error) => {
                            // Fallback to local demo data if backend fails
                            console.log("Backend unavailable, using local demo data");
                            setData1(localDemoData.user1);
                            setData2(localDemoData.user2);
                            setFetchedUsername1("DemoUser1");
                            setFetchedUsername2("DemoUser2");
                            setComparisonMode(true);
                            toast.info("Demo profiles loaded from local data");
                            setUsername1("");
                            setUsername2("");
                        }).finally(() => {
                            setSpinner(false);
                        });
                    }}>
                        🎭 Try Demo Data
                    </button>
                    {comparisonMode && (
                        <button className='reset-button' onClick={openResetModal}>
                            🗑️ Reset
                        </button>
                    )}
                </div>
                
                <ToastContainer theme="dark" position="top-right" pauseOnFocusLoss draggable autoClose={5000} pauseOnHover />
            </div>

            {!comparisonMode && <RenderEmptyState />}

            {comparisonMode && renderComparisonSummary()}

            {comparisonMode && (
                <div className='comparison-container'>
                    {renderComparisonCard(data1, fetchedUsername1, true)}
                    {renderComparisonCard(data2, fetchedUsername2, false)}
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="modal-overlay" onClick={closeResetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>🔄 Reset Comparison?</h3>
                        <p>Are you sure you want to clear all comparison data? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button className="modal-cancel" onClick={closeResetModal}>
                                Cancel
                            </button>
                            <button className="modal-confirm" onClick={resetComparison}>
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {spinner && <Spinner />}
        </>
    );
};

export default Scrape;