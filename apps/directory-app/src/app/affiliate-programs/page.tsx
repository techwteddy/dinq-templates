"use client";
import affiliatePrograms from '@/data/affiliateprograms.json';

export default function AffiliateProgramsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Affiliate Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive list of affiliate programs across various categories. Join programs that align with your audience to maximize your earning potential.
          </p>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-amber-100">
          <table className="min-w-full max-w-full w-full divide-y divide-amber-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Cookie Duration</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {affiliatePrograms.map((program, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">{program.Program}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{program.Category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-amber-600 font-semibold">{program["Commission Rate"]}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{program["Cookie Duration"]}</td>
                  <td className="px-4 py-3">{program.Description}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href="#" className="text-amber-600 hover:underline">{program.Action}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 