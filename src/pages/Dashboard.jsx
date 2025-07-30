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
  const [editingReport, setEditingReport] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

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

  const handleEdit = (report) => {
    setEditingReport(report);
    setUpdatedData({
      title: report.title,
      urgency: report.urgency,
      contact_name: report.contact_name,
      contact_email: report.contact_email,
      support_type: report.support_type
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('support_reports')
      .update(updatedData)
      .eq('id', editingReport.id);

    if (error) {
      console.error(error);
      setErrorMsg('Failed to update report.');
    } else {
      setEditingReport(null);
      setUpdatedData({});
      alert('Report updated successfully!');
    }
  };

const handleDelete = async (id) => {
  const { data, error } = await supabase
    .from('support_reports')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    setErrorMsg('Failed to delete report.');
  } else {
    setReports(reports.filter((report) => report.id !== id));
    alert('Report deleted successfully!');
  }
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

       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Reports</h2>
  
  {/* Added overflow-x-auto for responsiveness */}
  <div className="overflow-x-auto max-w-full">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <th className="py-2 px-4 text-left">Title</th>
          <th className="py-2 px-4 text-left">Urgency</th>
          <th className="py-2 px-4 text-left">Status</th>
          <th className="py-2 px-4 text-left">Contact</th>
          <th className="py-2 px-4 text-left">Support Type</th>
          <th className="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="py-2 px-4 text-gray-900 dark:text-gray-100">{report.title}</td>
            <td className="py-2 px-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                report.urgency === 'high' ? 'bg-red-500 text-white' :
                report.urgency === 'medium' ? 'bg-yellow-500 text-white' :
                'bg-green-500 text-white'
              }`}>
                {report.urgency}
              </span>
            </td>
            <td className="py-2 px-4">
              {report.status && Array.isArray(report.status) ? (
                report.status.map((status, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded-full text-xs mr-2 text-gray-900 dark:text-gray-100">
                    {status}
                  </span>
                ))
              ) : (
                <span className='text-gray-900 dark:text-gray-100'>No status available</span>
              )}
            </td>
            <td className="py-2 px-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{report.contact_name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{report.contact_email}</div>
            </td>
            <td className="py-2 px-4 text-gray-900 dark:text-gray-100">{report.support_type}</td>
            <td className="py-2 px-4 flex space-x-2">
              <button onClick={() => handleEdit(report)} className="text-blue-500 hover:text-blue-700">
                Edit
              </button>
              <button onClick={() => handleDelete(report.id)} className="text-red-500 hover:text-red-700">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
   
    </table>
  </div>
</div>

        {editingReport && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Report</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={updatedData.title || ''}
                    onChange={(e) => setUpdatedData({ ...updatedData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urgency Level</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={updatedData.urgency || ''}
                    onChange={(e) => setUpdatedData({ ...updatedData, urgency: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Name</label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={updatedData.contact_name || ''}
                    onChange={(e) => setUpdatedData({ ...updatedData, contact_name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={updatedData.contact_email || ''}
                    onChange={(e) => setUpdatedData({ ...updatedData, contact_email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="support_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Support Type</label>
                  <input
                    type="text"
                    id="support_type"
                    name="support_type"
                    value={updatedData.support_type || ''}
                    onChange={(e) => setUpdatedData({ ...updatedData, support_type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-4 mt-6">
                  <button type="button" onClick={() => setEditingReport(null)} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
