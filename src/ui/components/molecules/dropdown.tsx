"use client";

import Select, { NoticeProps, components, OptionProps } from "react-select";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "@/src/translations/use-translations";

export type DropdownProps = {
  options: { label: string; value: string }[];
  onChange: (option: { label: string; value: string }) => void;
  onAddNewClick?: () => void;
  disabled?: boolean;
  showAddButon?: boolean;
  onEditClick?: (value: string) => void;
  showEditButton?: boolean;
  defaultValue?: { label: string; value: string };
  maxMenuHeight?: number;
};

export const Dropdown = ({
  options,
  onChange,
  onAddNewClick,
  disabled,
  showAddButon = true,
  onEditClick,
  showEditButton,
  defaultValue,
  maxMenuHeight,
}: DropdownProps) => {
  const { dict } = useTranslations();
  const NoOptionsMessage = ({ children, ...props }: NoticeProps) => {
    return (
      <components.NoOptionsMessage
        {...props}
        innerProps={{ ...props.innerProps, onClick: onAddNewClick }}
      >
        <div className="flex text-base cursor-pointer hover:bg-blue-300 px-4 text-black py-1">
          <PlusIcon className="w-4 mr-1" />
          {dict.forms?.shared.add}
        </div>
      </components.NoOptionsMessage>
    );
  };

  const Option = ({ innerProps, ...props }: OptionProps) => {
    if (props.label === "add") {
      return (
        <components.Option
          innerProps={{ ...innerProps, onClick: onAddNewClick }}
          {...props}
          className="text-base"
        >
          <div className="flex">
            <PlusIcon className="w-4 mr-1" />
            {dict.forms?.shared.add}
          </div>
        </components.Option>
      );
    }

    const value = (props as any).value;

    if (showEditButton) {
      return (
        <components.Option innerProps={innerProps} {...props}>
          <div className="flex justify-between w-full">
            {props.children}
            <div
              onClick={() => onEditClick?.(value as string)}
              className="cursor-pointer"
            >
              <PencilSquareIcon className="w-4 mr-1" />
            </div>
          </div>
        </components.Option>
      );
    }

    return <components.Option innerProps={innerProps} {...props} />;
  };

  const finalOptions = showAddButon
    ? [
        ...options,
        {
          value: "add",
          label: "add",
        },
      ]
    : options;
  return (
    <Select
      options={finalOptions}
      isClearable
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: 16,
          outline: "none",
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: 16,
        }),
        noOptionsMessage: (base) => ({
          ...base,
          cursor: "pointer",
          padding: 0,
        }),
      }}
      onChange={(option) => {
        onChange(option as { label: string; value: string });
      }}
      // @ts-ignore
      components={{ NoOptionsMessage, Option }}
      isDisabled={disabled}
      className="text-neutral-800"
      defaultValue={defaultValue}
      maxMenuHeight={maxMenuHeight}
    />
  );
};
