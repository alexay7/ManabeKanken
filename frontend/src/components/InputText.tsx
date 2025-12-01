import {useState,type InputHTMLAttributes} from "react";


// Same props as input element
export default function InputText(props: InputHTMLAttributes<HTMLInputElement>) {
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return (
            <input
                id={`${props.id}-input`}
                type="text"
                className="border border-gray-300 rounded-md"
                value={props.value || ""}
                onChange={(e) => props.onChange?.(e)}
                onBlur={() => setEditMode(false)}
                placeholder={props.placeholder}
                style={{writingMode:"vertical-rl"}}
                autoFocus
            />
        );
    }

    if(!props.value && !props.placeholder) {
        return (
            <div
                className="cursor-pointer text-gray-500 hover:text-gray-700 bg-transparent h-[200px] w-full"
                onClick={() => {
                    setEditMode(true)
                }}
                style={{writingMode: "vertical-rl", textAlign: "center"}}
                />
        );
    }

    return (
        <p
            className="cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={() => setEditMode(true)}
            style={{writingMode: "vertical-rl", textAlign: "center"}}
        >
            {props.value || props.placeholder || ""}
        </p>
    );
}