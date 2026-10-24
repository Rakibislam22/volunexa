"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  ArrowLeft,
  Loader2,
  Calendar,
  Users,
} from "lucide-react";

export default function OrganizerAnalyticsPage() {
  const router = useRouter();
  const { isOrganizer, loading: authLoading } = useAuth();

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isOrganizer) {
      router.push("/login");
    }
  }, [authLoading, isOrganizer, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [catRes, regRes, statusRes] = await Promise.all([
          api.getEventsByCategory(),
          api.getRegistrationStats(),
          api.getVolunteerStatusBreakdown(),
        ]);

        if (catRes.success) setCategoryData(catRes.data || []);
        if (regRes.success) setRegistrationData(regRes.data || []);
        if (statusRes.success) setStatusData(statusRes.data || []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOrganizer) {
      fetchAnalytics();
    }
  }, [isOrganizer]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00494B]" />
        <p className="text-sm font-semibold text-slate-500">
          Loading analytics visualizations...
        </p>
      </div>
    );
  }

  const PIE_COLORS = ["#00494B", "#10B981", "#8B5CF6", "#F43F5E"];

  return (
    <div className="min-h-screen py-10 bg-slate-50/50 dark:bg-[#070c10] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/organizer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#00494B] dark:hover:text-teal-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organizer Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs font-bold text-[#00494B] dark:text-teal-400 uppercase tracking-wider mb-2">
            Organizer Visual Insights
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Event & Volunteer Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data visualizations of event categories, volunteer participation rates, and capacity utilization.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart 1: Events by Category */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[#00494B] dark:text-teal-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Events by Category
                </h3>
                <p className="text-xs text-slate-500">
                  Distribution of community initiatives hosted
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              {categoryData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No category data available yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="category"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Total Events"
                      fill="#00494B"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Volunteer Status Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <PieIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Volunteer Participation Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Registered vs Confirmed vs Attended vs Cancelled
                </p>
              </div>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              {statusData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No volunteer registrations recorded yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={45}
                      paddingAngle={4}
                      label={(props: any) => `${props.status || props.name}: ${props.count || props.value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Chart 3: Volunteer Registration Capacity Utilization */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Event Capacity Utilization
              </h3>
              <p className="text-xs text-slate-500">
                Comparing registered volunteers against maximum slot capacity per event
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            {registrationData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No event registrations recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="eventTitle"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar
                    dataKey="registered"
                    name="Registered Volunteers"
                    fill="#00494B"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="capacity"
                    name="Max Capacity"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
