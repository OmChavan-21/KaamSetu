import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  Check, 
  MessageSquare, 
  Star, 
  IndianRupee, 
  MapPin, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';

export function ActiveJobsManager() {
  const { jobs, updateJobStatus, setActiveChatJob, language, t } = useApp();
  const [ratingModalJob, setRatingModalJob] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('Excellent work, very punctual and finished cleanly.');

  const handleSimulateWorkerAccept = (jobId) => {
    updateJobStatus(jobId, { status: 'accepted' });
  };

  const handleStartWork = (jobId) => {
    updateJobStatus(jobId, { status: 'in_progress' });
  };

  const handleCompleteJob = (job) => {
    setRatingModalJob(job);
  };

  const submitRatingAndComplete = () => {
    if (!ratingModalJob) return;
    updateJobStatus(ratingModalJob.id, {
      status: 'completed',
      rating: ratingStars,
      review: reviewComment
    });
    setRatingModalJob(null);
  };

  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{t('navActiveJobs')}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
              {jobs.length} Gigs
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time gig lifecycle: Request Dispatched → Worker Accepted → Working → Completed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map(job => {
          const isPending = job.status === 'pending';
          const isAccepted = job.status === 'accepted';
          const isInProgress = job.status === 'in_progress';
          const isCompleted = job.status === 'completed';
          const isRejected = job.status === 'rejected';

          return (
            <div
              key={job.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                isRejected
                  ? 'bg-red-50/40 border-red-200'
                  : isInProgress 
                  ? 'bg-amber-50/50 border-amber-200 ring-2 ring-amber-400/20'
                  : isAccepted
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isCompleted
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h4 className="text-base font-black text-slate-900">{job.title}</h4>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isRejected ? 'bg-red-100 text-red-800 border border-red-300' :
                      isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      isAccepted ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                      isInProgress ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {job.status === 'rejected' ? 'Declined / Rejected' : job.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-700">Worker: {job.workerName} ({job.trade})</span>
                    <span>•</span>
                    <span className="flex items-center text-slate-500"><MapPin className="w-3 h-3 mr-0.5" />{job.location}</span>
                    <span>•</span>
                    <span className="font-extrabold text-emerald-700">₹{job.offeredWage}/day</span>
                  </p>
                </div>

                {/* Progress / Step pills */}
                {!isRejected ? (
                  <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                    <div className={`w-3 h-3 rounded-full ${isPending || isAccepted || isInProgress || isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Requested" />
                    <div className={`w-8 h-0.5 ${isAccepted || isInProgress || isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    <div className={`w-3 h-3 rounded-full ${isAccepted || isInProgress || isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Accepted" />
                    <div className={`w-8 h-0.5 ${isInProgress || isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    <div className={`w-3 h-3 rounded-full ${isInProgress || isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} title="In Progress" />
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Completed" />
                  </div>
                ) : (
                  <span className="text-xs text-red-600 font-bold bg-red-100 px-3 py-1 rounded-xl">
                    Declined by worker
                  </span>
                )}
              </div>

              {job.description && (
                <p className="text-xs text-slate-600 mb-3 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                  {job.description}
                </p>
              )}

              {/* Action Buttons depending on status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveChatJob(job)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t('chatWithEmployer')}</span>
                  </button>

                  {job.matchScore && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      ★ {job.matchScore}% Match
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {isPending && (
                    <button
                      onClick={() => handleSimulateWorkerAccept(job.id)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black shadow transition cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>⚡ Simulate Worker Acceptance</span>
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => handleStartWork(job.id)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow transition cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Gig (Worker Arrived)</span>
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      onClick={() => handleCompleteJob(job)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/30 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Work & Disburse Wage</span>
                    </button>
                  )}

                  {isCompleted && (
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800">
                      <span className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {job.rating || 5} Stars
                      </span>
                      <span>•</span>
                      <span>Wage Disbursed ₹{job.offeredWage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rating & Review Modal upon job completion */}
      {ratingModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-1">Rate & Close Gig</h3>
            <p className="text-xs text-slate-500 mb-4">
              Building verified trust for <span className="font-bold text-slate-800">{ratingModalJob.workerName}</span>
            </p>

            <div className="flex items-center justify-center space-x-2 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition cursor-pointer"
                >
                  <Star className={`w-8 h-8 ${star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Employer Feedback / Review
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 mb-4 font-semibold">
              Disbursing ₹{ratingModalJob.offeredWage} to {ratingModalJob.workerName}'s direct UPI wallet.
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRatingModalJob(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRatingAndComplete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                Submit Review & Complete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
