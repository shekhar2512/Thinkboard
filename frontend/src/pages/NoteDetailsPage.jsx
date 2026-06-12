import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import Navbar from "../components/Navbar";

const NoteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the note details on mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/notes/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setCreatedBy(response.data.createdBy);
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Failed to load note details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  // Update note handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !createdBy.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.put(`/notes/${id}`, { title, content, createdBy });
      toast.success("Note updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 pb-12">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Thinkboard</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/60 font-medium animate-pulse">Loading note details...</p>
          </div>
        ) : (
          <div className="card bg-base-200 border border-base-content/10 shadow-lg">
            <div className="card-body p-6 md:p-8">
              <h2 className="card-title text-2xl font-bold text-base-content mb-6">Edit Note</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content/75">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input input-bordered w-full focus:outline-none focus:border-primary text-base-content"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content/75">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note contents here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="textarea textarea-bordered h-64 focus:outline-none focus:border-primary leading-relaxed text-base-content"
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-base-content/75">Created By</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    className="input input-bordered w-full focus:outline-none focus:border-primary text-base-content"
                    maxLength={50}
                    required
                  />
                </div>

                <div className="card-actions justify-end pt-4 gap-3">
                  <Link to="/" className="btn btn-ghost">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary px-6 shadow-md hover:shadow-lg transition-all gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteDetailsPage;
