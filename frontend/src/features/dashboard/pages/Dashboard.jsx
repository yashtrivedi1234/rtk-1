import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AcademicCapIcon, PlusIcon, StarIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useGetDashboardQuery } from "../dashboard.api";
import Avatar from "../../../components/Avatar";
import StatCard from "../../../components/StatCard";
import PageHeader from "../../../components/PageHeader";
import Skeleton from "../../../components/Skeleton";
import Message from "../../../components/Message";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading, error } = useGetDashboardQuery();
  const maxCount = data?.topCourses[0]?.count || 1;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        subtitle="Here is a quick look at your students."
        action={
          <Link
            to="/students/add"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add student
          </Link>
        }
      />

      {isLoading && <Skeleton />}
      {error && <Message error>Could not load the dashboard. Is the server running?</Message>}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard icon={UsersIcon} label="Total students" value={data.totalStudents} />
            <StatCard icon={AcademicCapIcon} label="Courses" value={data.totalCourses} />
            <StatCard icon={StarIcon} label="Most popular course" value={data.topCourses[0]?.name ?? "-"} />
          </div>

          {data.totalStudents === 0 ? (
            <Message>
              <p>You have not added any students yet. Use the button above to add your first one.</p>
            </Message>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <section aria-labelledby="recent-heading" className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-line">
                <div className="mb-4 flex items-center justify-between">
                  <h3 id="recent-heading" className="font-bold">Recently added</h3>
                  <Link to="/students" className="text-sm font-semibold text-primary hover:underline">View all</Link>
                </div>
                <ul className="space-y-3">
                  {data.recentStudents.map((s) => (
                    <li key={s._id} className="flex items-center gap-3">
                      <Avatar name={s.name} url={s.image?.url} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{s.name}</p>
                        <p className="truncate text-xs text-subtle">{s.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="courses-heading" className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-line">
                <h3 id="courses-heading" className="mb-4 font-bold">Students by course</h3>
                <ul className="space-y-4">
                  {data.topCourses.map((c) => (
                    <li key={c.name}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="truncate font-semibold">{c.name}</span>
                        <span className="text-subtle">{c.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-primary-soft">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
