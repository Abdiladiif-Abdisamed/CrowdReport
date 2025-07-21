import React from 'react';
import { Users, TrendingUp, Clock, CheckCircle, AlertCircle, FileText, Activity, Map, Plus, Filter, Search, MoreVertical } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      label: "Active Reports",
      value: "1,247",
      change: "+12%",
      changeType: "increase",
      icon: <FileText className="h-6 w-6" />,
      color: "blue"
    },
    {
      label: "Volunteers Connected",
      value: "3,891",
      change: "+8%",
      changeType: "increase",
      icon: <Users className="h-6 w-6" />,
      color: "green"
    },
    {
      label: "Response Time",
      value: "4.2 min",
      change: "-23%",
      changeType: "decrease",
      icon: <Clock className="h-6 w-6" />,
      color: "yellow"
    },
    {
      label: "Success Rate",
      value: "97.8%",
      change: "+2%",
      changeType: "increase",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "purple"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "new_report",
      message: "New medical supplies request in Downtown area",
      time: "2 min ago",
      status: "pending",
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />
    },
    {
      id: 2,
      type: "volunteer_match",
      message: "3 volunteers matched to food distribution team",
      time: "5 min ago",
      status: "success",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      id: 3,
      type: "report_completed",
      message: "Emergency shelter setup completed successfully",
      time: "12 min ago",
      status: "completed",
      icon: <CheckCircle className="h-5 w-5 text-blue-600" />
    },
    {
      id: 4,
      type: "new_volunteer",
      message: "Sarah M. registered as medical professional",
      time: "18 min ago",
      status: "info",
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    {
      id: 5,
      type: "urgent_request",
      message: "Urgent: Transportation needed for elderly evacuation",
      time: "25 min ago",
      status: "urgent",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />
    }
  ];

  const quickActions = [
    {
      title: "Submit New Report",
      description: "Report a new support need",
      icon: <Plus className="h-6 w-6" />,
      color: "blue",
      href: "/submit"
    },
    {
      title: "View Map",
      description: "See active locations",
      icon: <Map className="h-6 w-6" />,
      color: "green",
      href: "#"
    },
    {
      title: "Activity Feed",
      description: "Real-time updates",
      icon: <Activity className="h-6 w-6" />,
      color: "yellow",
      href: "#"
    }
  ];

  const activeReports = [
    {
      id: "R-2025-001",
      title: "Medical Supply Distribution",
      location: "Central Hospital",
      priority: "High",
      volunteers: 8,
      status: "In Progress",
      timeLeft: "2 hours"
    },
    {
      id: "R-2025-002",
      title: "Food Bank Coordination",
      location: "Community Center",
      priority: "Medium",
      volunteers: 12,
      status: "Recruiting",
      timeLeft: "6 hours"
    },
    {
      id: "R-2025-003",
      title: "Emergency Shelter Setup",
      location: "Sports Complex",
      priority: "High",
      volunteers: 15,
      status: "Active",
      timeLeft: "1 hour"
    }
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Recruiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time overview of support coordination activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'increase' ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400' : 
                  stat.changeType === 'decrease' ? 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400' :
                  'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(action.color)}`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {action.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Reports</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Filter className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {activeReports.map((report) => (
                  <div key={report.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                            {report.id}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {report.location}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{report.volunteers} volunteers</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{report.timeLeft} left</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;