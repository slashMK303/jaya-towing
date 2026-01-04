
"use client";

import { Service } from "@prisma/client";
import ServiceCard from "./ServiceCard";
import ServiceDetailModal from "./ServiceDetailModal";
import { useState } from "react";

interface ServiceGridProps {
    services: Service[];
}

export default function ServiceGrid({ services }: ServiceGridProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectService = (service: any) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedService(null), 300);
    };

    return (
        <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={{
                            ...service,
                            price: Number(service.price),
                            slug: service.slug,
                            type: (service as any).type,
                            fleetType: (service as any).fleetType
                        } as any}
                        onSelect={handleSelectService}
                    />
                ))}
            </div>

            <ServiceDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                service={selectedService}
            />
        </>
    );
}
