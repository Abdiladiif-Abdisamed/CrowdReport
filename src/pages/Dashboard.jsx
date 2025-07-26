import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import {
  Users, TrendingUp, Clock, CheckCircle,
  AlertCircle, FileText, Activity, Map,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('support_reports')
        .select('*');

      if (error) {
        console.error(error);
        setErrorMsg('Failed to load reports.');
      } else {
        setReports(data);
      }
    };

    const fetchRecentActivities = async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
        setErrorMsg('Failed to load recent activities.');
      } else {
        setRecentActivities(data);
      }
    };

    fetchReports();
    fetchRecentActivities();

    const subscription = supabase
      .channel('support_reports_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const stats = [
    { label: "Active Reports", value: reports.length.toString(), icon: <FileText className="h-6 w-6" />, color: "blue" },
    { label: "Volunteers Connected", value: "3,891", icon: <Users className="h-6 w-6" />, color: "green" },
    { label: "Response Time", value: "4.2 min", icon: <Clock className="h-6 w-6" />, color: "yellow" },
    { label: "Success Rate", value: "97.8%", icon: <TrendingUp className="h-6 w-6" />, color: "purple" }
  ];

  const quickActions = [
    { title: "Submit New Report", description: "Report a new support need", icon: <Plus className="h-6 w-6" />, color: "blue", href: "/submit" },
    { title: "View Map", description: "See active locations", icon: <Map className="h-6 w-6" />, color: "green", href: "#" },
    { title: "Activity Feed", description: "Real-time updates", icon: <Activity className="h-6 w-6" />, color: "yellow", href: "#" }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Real-time overview of support coordination activities</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-lg shadow-md ${getColorClasses(stat.color)}`}>
              <div className="flex items-center gap-2">
                {stat.icon}
                <div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div key={index} className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ${getColorClasses(action.color)}`}>
              <div className="flex items-center justify-between">
                {action.icon}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
              <a href={action.href} className="mt-4 text-blue-600 dark:text-blue-400">Go</a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Reports</h2>
            {reports.map((report) => (
              <div key={report.id} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Priority:</strong> {report.priority}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Status:</strong> {report.status}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Location:</strong> {report.location}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Volunteers:</strong> {report.volunteers}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            {recentActivities.map((activity) => (
              <div key={activity.id} className="mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>{activity.message}</strong></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
