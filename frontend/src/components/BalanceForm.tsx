'use client';

type InputFieldProps = {
  label: string;
  type: string;
  placeholder: string;
};

const InputField = ({ label, type, placeholder }: InputFieldProps) => (
  <div className="mb-4">
    <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function BalanceForm() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold">入力欄</h2>
      <form>
        <InputField label="収入" type="number" placeholder="0" />
        <InputField label="支出" type="number" placeholder="0" />
        <InputField label="残高" type="number" placeholder="0" />
        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
