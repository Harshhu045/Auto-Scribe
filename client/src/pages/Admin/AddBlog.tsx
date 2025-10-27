import { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { marked } from "marked"; // better import

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("startup");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title!");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", { prompt: title });

      if (data.success && quillRef.current) {
        const html = await marked(data.content); // ensure conversion
        quillRef.current.root.innerHTML = html;
        toast.success("AI content generated!");
      } else {
        toast.error(data.message || "Failed to generate content");
      }
    } catch (error: any) {
      toast.error(error.message || "Error generating content");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("description", quillRef.current?.root.innerHTML || "");
      formData.append("category", category);
      formData.append("isPublished", String(isPublished));
      if (image) formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast.success(data.message);

        // Reset form
        setImage(null);
        setTitle("");
        setSubTitle("");
        if (quillRef.current) quillRef.current.root.innerHTML = "";
        setCategory("startup");
        setIsPublished(false);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            className="mt-2 h-16 rounded cursor-pointer"
            alt=""
          />
          <input
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Blog title</p>
        <input
          type="text"
          className="w-full max-w-lg p-2 border border-gray-300 outline-none rounded"
          placeholder="Type here..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />

        <p className="mt-4">Sub title</p>
        <input
          type="text"
          className="w-full max-w-lg p-2 border border-gray-300 outline-none rounded"
          placeholder="Type here..."
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
          required
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:bg-button cursor-pointer disabled:opacity-50"
            type="button"
            onClick={generateContent}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate with AI✨"}
          </button>
        </div>

        <p className="mt-4">Blog category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          value={category}
        >
          <option value="">Select Category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
            checked={isPublished}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-button text-white rounded cursor-pointer text-sm transition-transform duration-150 active:scale-95 hover:scale-105 hover:brightness-105"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
