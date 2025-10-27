import { useNavigate } from "react-router-dom"
import { assets, footer_data } from "../assets/assets"


const Footer = () => {
    const navigate  = useNavigate();

    return (
        <div className="px-6 md:px16 lg:px-32 xl:px-32 bg-primary/3">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src={assets.new_logo}
                            alt="logo"
                            className="w-10 sm:w-10"
                        />
                        <p className="text-xl font-semibold text-gray-800">Blogger</p>
                    </div>
                    <p className="max-w-[410px] mt-6 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio dolorum nemo
                        nisi cupiditate officiis similique. Velit sint molestias delectus laudantium, fugit
                        corporis ea ipsa excepturi maiores repellendus? </p>
                </div>

                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footer_data.map((section, index) => (
                        <div key={index}>
                            <h3 className=" font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="*" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">Copyright 2025 © QuickBlog Harsh Upadhyay - All rights are Reserved</p>
        </div>
    )
}

export default Footer