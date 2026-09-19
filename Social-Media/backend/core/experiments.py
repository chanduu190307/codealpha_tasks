import hashlib

class ExperimentationService:
    """
    Deterministic A/B Testing & Feature Experimentation Framework.
    Partitions users deterministically into control vs variant groups.
    """

    @classmethod
    def get_variant(cls, experiment_name: str, user_id: int) -> str:
        if not user_id:
            return 'control'

        key = f"{experiment_name}:{user_id}".encode('utf-8')
        hash_val = int(hashlib.md5(key).hexdigest(), 16)
        bucket = hash_val % 100

        # 50/50 split default
        if bucket < 50:
            return 'control'
        return 'variant'

    @classmethod
    def is_variant_active(cls, experiment_name: str, user_id: int) -> bool:
        return cls.get_variant(experiment_name, user_id) == 'variant'
