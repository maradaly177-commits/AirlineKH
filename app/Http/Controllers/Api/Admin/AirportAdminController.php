<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\AirportService;
use Illuminate\Http\Request;

class AirportAdminController extends Controller
{
    protected $airportService;

    public function __construct(AirportService $airportService)
    {
        $this->airportService = $airportService;
    }

    public function index()
    {
        return response()->json(
            $this->airportService->getAllAirports()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|max:10|unique:airports',
            'name' => 'required',
            'city' => 'required',
        ]);

        return response()->json(
            $this->airportService->createAirport($validated)
        );
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'code' => 'required|max:10|unique:airports,code,' . $id,
            'name' => 'required',
            'city' => 'required',
        ]);

        return response()->json(
            $this->airportService->updateAirport($id, $validated)
        );
    }

    public function destroy($id)
    {
        try {
            $this->airportService->deleteAirport($id);

            return response()->json([
                'message' => 'Deleted successfully'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Không thể xóa sân bay này vì đang có chuyến bay sử dụng sân bay này trong hệ thống.'
            ], 422);
        }
    }
}